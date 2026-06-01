import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import type { Request } from 'express';
import { SupabaseAuthGuard } from '../orders/guards/supabase-auth.guard';
import { CreateCatchDto } from './dto/create-catch.dto';
import {
  CreateCatchResponseDto,
  GetCatchesResponseDto,
} from './dto/catch-response.dto';
import { CatchesService } from './catches.service';
import { GetCatchesQueryDto } from './dto/get-catches-query.dto';
import { TopFishQueryDto } from './dto/top-fish-query.dto';
import { TopFishResponseDto } from './dto/top-fish-response.dto';

type RequestWithUser = Request & {
  user?: {
    id: string;
    email?: string;
    phone?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      surname?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

@ApiTags('Avlar (Catches)')
@Controller('catches')
// Bu controller, av kayitlari ve istatistik endpoint'lerini sunar.
export class CatchesController {
  constructor(private readonly catchesService: CatchesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Yeni av kaydi olusturur',
    description:
      'Yetkili kullanicinin av kaydini olusturur. Konum bilgisi verilirse hava durumu bilgisi de otomatik olarak eklenir.',
  })
  @ApiResponse({
    status: 201,
    description: 'Av kaydi basariyla olusturuldu.',
    type: CreateCatchResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Gecersiz av kaydi verisi.' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme basarisiz.' })
  create(
    @Req() request: RequestWithUser,
    @Body() createCatchDto: CreateCatchDto,
  ): Promise<CreateCatchResponseDto> {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Kimlik dogrulanamadi');
    }

    return this.catchesService.createCatch(userId, createCatchDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Kullaniciya ait av kayitlarini listeler',
    description:
      'Sadece oturum acan kullanicinin av kayitlarini dondurur. Limit ve siralama parametreleri ile filtrelenebilir.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Dondurulecek maksimum kayit sayisi',
    example: 1,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Olusturulma tarihine gore siralama yonu (varsayilan: desc)',
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Av kayitlari basariyla getirildi.',
    type: GetCatchesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme basarisiz.' })
  findAll(
    @Req() request: RequestWithUser,
    @Query() query: GetCatchesQueryDto,
  ): Promise<GetCatchesResponseDto> {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Kimlik dogrulanamadi');
    }

    return this.catchesService.findAllByUserId(userId, query);
  }

  @Get('top-fish')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'En cok tutulan balik turlerini getirir',
    description:
      'Tum av kayitlarina gore en sik yakalanan balik turlerini sayiya gore sirali olarak dondurur.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Dondurulecek maksimum balik turu sayisi (varsayilan: 10)',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'En cok tutulan balik turleri basariyla getirildi.',
    type: TopFishResponseDto,
  })
  // Bu metot, herkese acik olarak en cok tutulan balik turlerini dondurur.
  getTopFish(@Query() query: TopFishQueryDto): Promise<TopFishResponseDto> {
    return this.catchesService.getTopFish(query.limit);
  }
}
