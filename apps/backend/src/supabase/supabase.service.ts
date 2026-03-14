import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private supabase: SupabaseClient;
    private readonly logger = new Logger(SupabaseService.name);

    // Uygulama başladığında bu fonksiyon otomatik çalışır
    onModuleInit() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            this.logger.error('Supabase URL veya Key .env dosyasında bulunamadı!');
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);

        // Bağlantıyı hemen test edelim
        this.checkConnection();
    }

    private async checkConnection() {
        try {
            // Auth servisinin ayakta olup olmadığını basit bir sorguyla test ediyoruz
            const { data, error } = await this.supabase.auth.getSession();

            if (error) throw error;

            this.logger.log('✅ Supabase bağlantısı başarılı! Auth servisi hazır.');
        } catch (err) {
            this.logger.error('❌ Supabase bağlantı hatası:', err.message);
        }
    }

    // Diğer servislerin kullanabilmesi için istemciyi dışarı açıyoruz
    getClient() {
        return this.supabase;
    }
}