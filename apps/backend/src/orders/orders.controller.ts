import {
  Body,
  Controller,
  Get,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { TopProductsQueryDto } from './dto/top-products-query.dto';
import { TopProductsResponseDto } from './dto/top-products-response.dto';
import { UserOrdersResponseDto } from './dto/user-orders-response.dto';

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
@Controller('orders')
// Bu controller, siparis olusturma ve istatistik endpoint'lerini sunar.
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
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

  @Get('top-products')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'En cok satan urunleri getirir',
    description:
      'Siparis gecmisine gore en cok siparis edilen urunleri sayiya gore sirali olarak dondurur.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Dondurulecek maksimum urun sayisi (varsayilan: 10)',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'En cok satan urunler basariyla getirildi.',
    type: TopProductsResponseDto,
  })
  // Bu metot, herkese acik olarak en cok siparis edilen urunleri dondurur.
  getTopProducts(
    @Query() query: TopProductsQueryDto,
  ): Promise<TopProductsResponseDto> {
    return this.ordersService.getTopProducts(query.limit);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({
    summary: 'Kullanicinin siparislerini getirir',
    description:
      'Kimlik dogrulanmis kullaniciya ait tum siparisleri, urun detaylariyla birlikte yeniden eskiye dogru sirali olarak dondurur.',
  })
  @ApiResponse({
    status: 200,
    description: 'Siparisler basariyla getirildi.',
    type: UserOrdersResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme basarisiz.' })
  // Bu metot, token'dan alinan user_id ile yalnizca o kullaniciya ait siparisleri dondurur.
  getUserOrders(
    @Req() request: RequestWithUser,
  ): Promise<UserOrdersResponseDto> {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Kimlik dogrulanamadi');
    }

    return this.ordersService.getUserOrders(userId);
  }
}
