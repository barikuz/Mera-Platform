import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
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
@ApiBearerAuth()
@Controller('catches')
@UseGuards(SupabaseAuthGuard)
export class CatchesController {
  constructor(private readonly catchesService: CatchesService) {}

  @Post()
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
  @ApiOperation({
    summary: 'Kullaniciya ait av kayitlarini listeler',
    description:
      'Sadece oturum acan kullanicinin av kayitlarini, en yeniden en eskiye dogru siralayarak dondurur.',
  })
  @ApiResponse({
    status: 200,
    description: 'Av kayitlari basariyla getirildi.',
    type: GetCatchesResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme basarisiz.' })
  findAll(@Req() request: RequestWithUser): Promise<GetCatchesResponseDto> {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Kimlik dogrulanamadi');
    }

    return this.catchesService.findAllByUserId(userId);
  }
}
