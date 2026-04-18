import {
  Body,
  Controller,
  UnauthorizedException,
  Post,
  Req,
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
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

type RequestWithUser = Request & {
  user?: {
    id: string;
    email?: string;
    [key: string]: unknown;
  };
};

@ApiTags('Siparisler (Orders)')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(SupabaseAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Yeni siparis olusturur',
    description:
      'Gonderilen urunleri server tarafinda fiyat dogrulamasindan gecirir ve siparisi olusturur.',
  })
  @ApiResponse({ status: 201, description: 'Siparis başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz sipariş verisi.' })
  @ApiResponse({ status: 401, description: 'Yetkilendirme başarısız.' })
  create(
    @Req() request: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Kimlik dogrulanamadi');
    }

    return this.ordersService.createOrder(userId, createOrderDto);
  }
}
