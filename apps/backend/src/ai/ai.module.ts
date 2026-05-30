import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { WeatherModule } from '../weather/weather.module';
import { FishingSpotsModule } from '../fishing-spots/fishing-spots.module';

@Module({
  imports: [SupabaseModule, WeatherModule, FishingSpotsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
