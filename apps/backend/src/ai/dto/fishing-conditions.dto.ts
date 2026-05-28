/**
 * FishingConditionsDto - Av Kosullari Endpoint DTOs
 *
 * GET /fishing-conditions icin istek ve yanit veri transfer nesneleri.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

// ---------------------------------------------------------------------------
// Request
// ---------------------------------------------------------------------------

export class FishingConditionsRequestDto {
  @ApiProperty({
    description: 'Kullanicinin enlemi',
    example: 41.0082,
    minimum: -90,
    maximum: 90,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  userLat!: number;

  @ApiProperty({
    description: 'Kullanicinin boylamı',
    example: 28.9784,
    minimum: -180,
    maximum: 180,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  userLng!: number;
}

// ---------------------------------------------------------------------------
// Response – AI interpretation block
// ---------------------------------------------------------------------------

export class FishingConditionsAiDto {
  @ApiProperty({
    description: 'Av durumu degerlendirmesi',
    enum: ['good', 'okay', 'poor'],
    example: 'good',
  })
  status!: 'good' | 'okay' | 'poor';

  @ApiProperty({
    description: 'Bir veya iki cumlelik aciklama',
    example: 'Hafif ruzgar ve stabil basinc, sabah ve aksam verimli.',
  })
  description!: string;
}

// ---------------------------------------------------------------------------
// Response – combined
// ---------------------------------------------------------------------------

export class FishingConditionsResponseDto {
  @ApiProperty({ type: FishingConditionsAiDto })
  ai!: FishingConditionsAiDto;
}
