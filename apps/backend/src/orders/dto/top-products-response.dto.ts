import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TopProductDto {
  @ApiProperty({
    description: 'Urun adi',
    example: 'Shimano Nexave 2500',
  })
  name!: string;

  @ApiProperty({
    description: 'Urun fiyati',
    example: 1299.99,
  })
  price!: number;

  @ApiPropertyOptional({
    description: "Urun resim URL'i",
    example: 'https://example.com/image.png',
    nullable: true,
  })
  image_url!: string | null;

  @ApiProperty({
    description: 'Toplam siparis adedi',
    example: 42,
  })
  order_count!: number;
}

export class TopProductsResponseDto {
  @ApiProperty({
    description: 'Islem mesaji',
    example: 'En cok satan urunler getirildi',
  })
  message!: string;

  @ApiProperty({ type: TopProductDto, isArray: true })
  data!: TopProductDto[];
}
