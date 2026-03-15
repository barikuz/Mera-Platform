import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env dosyasını tüm projede erişilebilir yapar
    }),
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule { }
