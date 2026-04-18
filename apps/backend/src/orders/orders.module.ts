import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [OrdersController],
  providers: [OrdersService, SupabaseAuthGuard],
})
export class OrdersModule {}
