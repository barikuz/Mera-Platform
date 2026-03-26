/**
 * GetWeatherQueryDto - Hava Durumu Sorgu Parametreleri
 *
 * GET /weather endpoint'ine gonderilecek sorgu parametrelerini dogrular.
 * Enlem ve boylam degerleri gecerli araliklarda olmalidir.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetWeatherQueryDto {
  @ApiProperty({
    description: 'Enlem (latitude) değeri',
    example: 38.7963,
    minimum: -90,
    maximum: 90,
  })
  @Type(() => Number) // Query params string olarak gelir, number'a cevir
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: 'Boylam (longitude) değeri',
    example: 38.7495,
    minimum: -180,
    maximum: 180,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;
}
