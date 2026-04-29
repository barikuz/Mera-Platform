import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [SupabaseModule, WeatherModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
