import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CatchRecordDto {
  @ApiProperty({
    description: 'Av kaydinin benzersiz kimligi',
    example: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Kaydi olusturan kullanicinin kimligi',
    example: 'uuid',
  })
  user_id!: string;

  @ApiProperty({ description: 'Yakaladiginiz baligin turu', example: 'Sazan' })
  species!: string;

  @ApiPropertyOptional({
    description: 'Baligin kilogram cinsinden agirligi',
    example: 2.75,
    nullable: true,
  })
  weight_kg!: number | null;

  @ApiPropertyOptional({
    description: 'Baligin santimetre cinsinden boyu',
    example: 48.2,
    nullable: true,
  })
  length_cm!: number | null;

  @ApiPropertyOptional({
    description: 'Av noktasinin enlem degeri',
    example: 38.4237,
    nullable: true,
  })
  location_lat!: number | null;

  @ApiPropertyOptional({
    description: 'Av noktasinin boylam degeri',
    example: 38.1234,
    nullable: true,
  })
  location_lng!: number | null;

  @ApiPropertyOptional({
    description: 'O anda kaydedilen sicaklik (Celsius)',
    example: 18.4,
    nullable: true,
  })
  weather_temp_c!: number | null;

  @ApiPropertyOptional({
    description: 'O anda kaydedilen basinc (hPa)',
    example: 1013,
    nullable: true,
  })
  weather_pressure_hpa!: number | null;

  @ApiPropertyOptional({
    description: 'O anda kaydedilen ruzgar hizi (km/sa)',
    example: 14.4,
    nullable: true,
  })
  weather_wind_speed_kmh!: number | null;

  @ApiProperty({
    description: 'Kaydin olusturulma zamani',
    example: '2026-04-19T10:15:30.000Z',
  })
  created_at!: string;

  @ApiPropertyOptional({
    description: 'Kaydin guncellenme zamani',
    example: '2026-04-19T10:15:30.000Z',
    nullable: true,
  })
  updated_at?: string | null;
}

export class CreateCatchResponseDto {
  @ApiProperty({
    description: 'Islem mesaji',
    example: 'Av kaydi basariyla eklendi',
  })
  message!: string;

  @ApiProperty({ type: CatchRecordDto })
  data!: CatchRecordDto;
}

export class GetCatchesResponseDto {
  @ApiProperty({
    description: 'Islem mesaji',
    example: 'Av kayitlari getirildi',
  })
  message!: string;

  @ApiProperty({ type: CatchRecordDto, isArray: true })
  data!: CatchRecordDto[];
}
