/**
 * WeatherResponseDto - Hava Durumu Yanit Yapisi
 *
 * GET /weather endpoint'inden donen yanitin Swagger dokumantasyonu icin
 * kullanilan DTO. Tip guvenligi ve API dokumantasyonu saglar.
 */
import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({
    description: 'Güncel sıcaklık (Celsius)',
    example: 22.5,
  })
  temperature: number;

  @ApiProperty({
    description: 'Rüzgar hızı (metre/saniye)',
    example: 3.5,
  })
  windSpeed: number;

  @ApiProperty({
    description: 'Atmosfer basıncı (hPa)',
    example: 1013,
  })
  pressure: number;
}
