/**
 * WeatherModule - Hava Durumu Modulu
 *
 * Hava durumu ozelligi icin gerekli controller ve service'i icerir.
 * ConfigModule global oldugu icin import edilmesine gerek yoktur.
 */
import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
