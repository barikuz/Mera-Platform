/**
 * WeatherController - Hava Durumu API Endpoint'leri
 *
 * Balikcilarin konum bazli hava durumu bilgilerini alabilmesi icin
 * REST API endpoint'lerini tanimlar.
 *
 * Base URL: /weather
 */
import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherQueryDto } from './dto/get-weather-query.dto';
import { WeatherResponseDto } from './dto/weather-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Hava Durumu (Weather)')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  /**
   * GET /weather?lat=XX&lon=YY
   * Belirtilen koordinatlar icin guncel hava durumu bilgilerini dondurur.
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Koordinat bazli hava durumu getirir',
    description:
      'Belirtilen enlem ve boylam icin OpenWeather API uzerinden guncel sicaklik, ruzgar hizi ve basinc bilgilerini dondurur.',
  })
  @ApiQuery({
    name: 'lat',
    type: Number,
    description: 'Enlem degeri (-90 ile 90 arasi)',
  })
  @ApiQuery({
    name: 'lon',
    type: Number,
    description: 'Boylam degeri (-180 ile 180 arasi)',
  })
  @ApiResponse({
    status: 200,
    description: 'Hava durumu basariyla getirildi.',
    type: WeatherResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Gecersiz koordinat degerleri.',
  })
  @ApiResponse({
    status: 502,
    description: 'Hava durumu servisi kullanilamiyor veya timeout.',
  })
  async getWeather(
    @Query() query: GetWeatherQueryDto,
  ): Promise<WeatherResponseDto> {
    return this.weatherService.getWeather(query.lat, query.lon);
  }
}
