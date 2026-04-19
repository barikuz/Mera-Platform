import { Module } from '@nestjs/common';
import { CatchesController } from './catches.controller';
import { CatchesService } from './catches.service';
import { SupabaseAuthGuard } from '../orders/guards/supabase-auth.guard';
import { WeatherService } from '../weather/weather.service';

@Module({
  controllers: [CatchesController],
  providers: [CatchesService, SupabaseAuthGuard, WeatherService],
})
export class CatchesModule {}
