import { ApiProperty } from '@nestjs/swagger';

// Siparis kaleminin urun detaylariyla birlikte Swagger dokumantasyonu icin DTO'su.
export class OrderItemDetailDto {
  @ApiProperty({
    description: 'Urun adi',
    example: 'Shimano Nexave 2500',
  })
  product_name!: string;

  @ApiProperty({
    description: 'Siparis adedi',
    example: 2,
  })
  quantity!: number;

  @ApiProperty({
    description: 'Birim fiyat',
    example: 1299.99,
  })
  unit_price!: number;
}

// Tek bir siparisın kisa ozetini ve kalemlerini tasir.
export class UserOrderDto {
  @ApiProperty({
    description: 'Siparis durumu',
    example: 'pending',
  })
  status!: string;

  @ApiProperty({
    description: 'Toplam tutar',
    example: 2599.98,
  })
  total_amount!: number;

  @ApiProperty({
    description: 'Teslimat alici adi',
    example: 'Ahmet Yilmaz',
  })
  shipping_name!: string;

  @ApiProperty({
    description: 'Teslimat telefon numarasi',
    example: '+905551234567',
  })
  shipping_phone!: string;

  @ApiProperty({
    description: 'Teslimat adresi',
    example: 'Ataturk Cad. No:1, Istanbul',
  })
  shipping_address!: string;

  @ApiProperty({
    description: 'Siparisın olusturulma tarihi (ISO 8601)',
    example: '2026-06-03T10:00:00.000Z',
  })
  created_at!: string;

  @ApiProperty({ type: OrderItemDetailDto, isArray: true })
  items!: OrderItemDetailDto[];
}

// GET /orders endpoint'inin zarf yapisini tanimlar.
export class UserOrdersResponseDto {
  @ApiProperty({
    description: 'Islem mesaji',
    example: 'Siparisler basariyla getirildi',
  })
  message!: string;

  @ApiProperty({ type: UserOrderDto, isArray: true })
  data!: UserOrderDto[];
}
