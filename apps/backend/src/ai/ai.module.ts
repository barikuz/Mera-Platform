import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { WeatherModule } from '../weather/weather.module';
import { FishingSpotsModule } from '../fishing-spots/fishing-spots.module';

/** 30 dakika – saniye cinsinden */
const CACHE_TTL_MS = 30 * 60 * 1000;

@Module({
  imports: [
    CacheModule.register({ ttl: CACHE_TTL_MS }),
    SupabaseModule,
    WeatherModule,
    FishingSpotsModule,
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
