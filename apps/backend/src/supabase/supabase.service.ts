/**
 * SupabaseService - Supabase Veritabanı Bağlantı Servisi
 *
 * Bu servis, Supabase istemcisinin yaşam döngüsünü yönetir.
 * Uygulama başlatıldığında bağlantıyı kurar ve diğer servislerin
 * veritabanı işlemleri için kullanabileceği istemciyi sağlar.
 *
 * Gerekli ortam değişkenleri (.env):
 * - SUPABASE_URL: Supabase proje URL'i
 * - SUPABASE_ANON_KEY: Supabase anonim API anahtarı
 */
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  // Supabase istemci instance'ı - tüm veritabanı işlemleri için kullanılır
  private supabase: SupabaseClient;

  // NestJS Logger - uygulama logları için
  private readonly logger = new Logger(SupabaseService.name);

  /**
   * OnModuleInit lifecycle hook'u
   * Modül başlatıldığında otomatik olarak çağrılır.
   * Supabase istemcisini oluşturur ve bağlantıyı test eder.
   */
  onModuleInit() {
    // Ortam değişkenlerinden Supabase yapılandırmasını al
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    // Yapılandırma eksikse hata logla ve çık
    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase URL veya Key .env dosyasında bulunamadı!');
      return;
    }

    // Supabase istemcisini oluştur
    this.supabase = createClient(supabaseUrl, supabaseKey);

    // Bağlantıyı doğrulamak için test sorgusu çalıştır
    this.checkConnection();
  }

  /**
   * Supabase bağlantısını test eder.
   * Auth servisine basit bir sorgu göndererek bağlantının sağlıklı olduğunu doğrular.
   */
  private async checkConnection() {
    try {
      // Auth servisinin ayakta olup olmadığını basit bir sorguyla test ediyoruz
      const { error } = await this.supabase.auth.getSession();

      if (error) throw error;

      this.logger.log('✅ Supabase bağlantısı başarılı! Auth servisi hazır.');
    } catch (err) {
      this.logger.error('❌ Supabase bağlantı hatası:', (err as Error).message);
    }
  }

  /**
   * Supabase istemcisini döndürür.
   * Diğer servisler bu metodu kullanarak veritabanı işlemleri yapabilir.
   *
   * @returns SupabaseClient - Yapılandırılmış Supabase istemcisi
   */
  getClient() {
    return this.supabase;
  }
}
