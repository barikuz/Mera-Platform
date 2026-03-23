/**
 * SupabaseModule - Supabase Entegrasyon Modülü
 *
 * Bu modül, Supabase veritabanı bağlantısını uygulama genelinde kullanılabilir hale getirir.
 *
 * @Global() dekoratörü sayesinde bu modül bir kez import edildiğinde,
 * SupabaseService tüm modüllerde otomatik olarak enjekte edilebilir.
 * Bu yaklaşım, dependency inversion prensibine uygun olarak merkezi
 * veritabanı erişimi sağlar.
 */
import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Global() // Tüm modüllerde otomatik erişim için global olarak işaretlenir
@Module({
  // Supabase istemcisini yöneten servis
  providers: [SupabaseService],
  // Diğer modüllerin kullanabilmesi için dışa aktarılır
  exports: [SupabaseService],
})
export class SupabaseModule {}
