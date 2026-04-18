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
import { OrdersService } from './orders.service.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

// Bu tip, guard tarafinda request'e eklenen kullanici bilgisini guvenli sekilde tasir.
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

@ApiTags('Siparisler (Orders)')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(SupabaseAuthGuard)
// Bu controller, yetkili kullanicinin siparis olusturma endpoint'ini sunar.
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
  // Bu metot, kullaniciyi dogrular, istemci IP'sini belirler ve siparis olusturma akisina delege eder.
  create(
    @Req() request: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Kimlik dogrulanamadi');
    }

    const forwardedFor = request.headers['x-forwarded-for'];
    const clientIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim() || request.ip || '127.0.0.1';

    return this.ordersService.createOrder(
      userId,
      createOrderDto,
      request.user,
      clientIp,
    );
  }
}
