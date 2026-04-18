import { Module } from '@nestjs/common';
import { IyzipayModule } from '../iyzipay/iyzipay.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

// Bu modul, siparis endpoint'lerini, yetkilendirme korumasini ve siparis is akisini birlestirir.
@Module({
  imports: [SupabaseModule, IyzipayModule],
  controllers: [OrdersController],
  providers: [OrdersService, SupabaseAuthGuard],
})
export class OrdersModule {}
