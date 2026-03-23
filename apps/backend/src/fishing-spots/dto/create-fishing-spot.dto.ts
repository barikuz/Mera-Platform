/**
 * CreateFishingSpotDto - Mera Oluşturma Veri Transfer Nesnesi
 *
 * Bu DTO, yeni bir mera oluştururken gönderilecek verilerin yapısını
 * ve doğrulama kurallarını tanımlar.
 *
 * class-validator: Gelen verileri doğrular
 * @nestjs/swagger: API dokümantasyonu için metadata sağlar
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateFishingSpotDto {
  // Meranın adı - zorunlu alan
  @ApiProperty({
    description: 'Meranın adı',
    example: 'Keban Barajı - Çırçır Mevkii',
  })
  @IsString()
  name: string;

  // Mera açıklaması - opsiyonel
  @ApiPropertyOptional({
    description: 'Mera hakkında detaylı açıklama',
    example:
      'Sazan ve alabalık için popüler, kayalık yapısıyla dikkat çeken derin bir mera.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  // Enlem değeri - geçerli aralık: -90 ile 90 arası
  @ApiProperty({
    description: 'Merkez noktanın enlem (latitude) değeri',
    example: 38.7963,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  center_lat: number;

  // Boylam değeri - geçerli aralık: -180 ile 180 arası
  @ApiProperty({
    description: 'Merkez noktanın boylam (longitude) değeri',
    example: 38.7495,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  center_lng: number;

  // Yarıçap (metre) - minimum 10 metre olmalı
  @ApiPropertyOptional({
    description: 'Merkezden dışa doğru alanın yarıçapı (metre cinsinden)',
    default: 500,
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(10)
  radius_meters?: number;

  // Su tipi - zorunlu alan
  @ApiProperty({
    description: 'Suyun tipi (Örn: Tatlı Su, Tuzlu Su)',
    example: 'Tatlı Su',
  })
  @IsString()
  water_type: string;

  // Minimum derinlik (metre) - negatif olamaz
  @ApiPropertyOptional({
    description: 'Bölgedeki tahmini minimum derinlik (metre)',
    example: 5.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_depth?: number;

  // Maksimum derinlik (metre) - negatif olamaz
  @ApiPropertyOptional({
    description: 'Bölgedeki tahmini maksimum derinlik (metre)',
    example: 25.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  max_depth?: number;

  // Gizlilik ayarı - varsayılan olarak herkese açık
  @ApiPropertyOptional({
    description: 'Meranın herkes tarafından görülüp görülemeyeceği (Gizlilik)',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}
