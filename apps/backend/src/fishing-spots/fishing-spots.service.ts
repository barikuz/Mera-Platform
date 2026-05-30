/**
 * FishingSpotsService - Mera İş Mantığı Servisi
 *
 * Bu servis, balık avlama noktaları (meralar) için veritabanı işlemlerini yönetir.
 * Supabase üzerinden CRUD operasyonları gerçekleştirir ve hata yönetimini sağlar.
 */
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateFishingSpotDto } from './dto/create-fishing-spot.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { FishingSpot } from './entities/fishing-spot.entity';

/**
 * Supabase 'fishing_spots' tablosundan dönen ham satır tipi.
 * Hem RPC (get_closest_fishing_spots) hem de doğrudan select sorgularında kullanılır.
 */
export type SupabaseFishingSpotRow = {
  name: string;
  water_type: string;
  min_depth?: number | string | null;
  max_depth?: number | string | null;
  center_lat: number | string;
  center_lng: number | string;
};

@Injectable()
export class FishingSpotsService {
  private readonly logger = new Logger(FishingSpotsService.name);

  // SupabaseService, @Global() modül sayesinde otomatik olarak enjekte edilir
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Yeni bir mera oluşturur.
   * Supabase'e insert işlemi yapar ve oluşturulan kaydı döndürür.
   *
   * @throws BadRequestException - Aynı mera zaten varsa (PostgreSQL unique constraint: 23505)
   * @throws InternalServerErrorException - Diğer veritabanı hataları için
   */
  async create(createFishingSpotDto: CreateFishingSpotDto) {
    const response = await this.supabaseService
      .getClient()
      .from('fishing_spots')
      .insert(createFishingSpotDto)
      .select()
      .single<FishingSpot>(); // Tip güvenliği için generic kullanıyoruz

    if (response.error) {
      // PostgreSQL unique constraint ihlali kontrolü
      if (response.error.code === '23505') {
        throw new BadRequestException('Bu mera zaten mevcut');
      }
      throw new InternalServerErrorException(
        `Mera oluşturulurken hata oluştu: ${response.error.message}`,
      );
    }

    return { message: 'Mera başarıyla eklendi', data: response.data };
  }

  /**
   * Tüm meraları listeler.
   * Harita üzerinde gösterim için kullanılır.
   *
   * @throws InternalServerErrorException - Veritabanı sorgu hatası durumunda
   */
  async findAll() {
    const response = await this.supabaseService
      .getClient()
      .from('fishing_spots')
      .select('*');

    if (response.error) {
      throw new InternalServerErrorException(
        `Meralar getirilirken hata oluştu: ${response.error.message}`,
      );
    }

    return {
      message: 'Tüm meralar getirildi',
      // Tip güvenliği için açık type assertion kullanıyoruz
      data: response.data as FishingSpot[],
    };
  }

  /**
   * Veritabanı fonksiyonu aracılığıyla kullanıcıya en yakın `limit` adet
   * avlak noktasını getirir.
   *
   * Mesafe hesabı (Haversine) ve sıralama tamamen PostgreSQL tarafında yapılır;
   * backend sadece sonuçları alır.
   *
   * DB fonksiyonu: get_closest_fishing_spots (supabase/migrations/)
   *
   * @returns En yakın noktaların listesi; RPC hatası durumunda boş dizi döner.
   */
  async fetchClosestSpots(
    userLat: number,
    userLng: number,
    limit: number,
  ): Promise<SupabaseFishingSpotRow[]> {
    const { data, error } = (await this.supabaseService
      .getClient()
      .rpc('get_closest_fishing_spots', {
        user_lat: userLat,
        user_lng: userLng,
        result_limit: limit,
      })) as {
      data: SupabaseFishingSpotRow[] | null;
      error: { message: string } | null;
    };

    if (error) {
      this.logger.error(
        `get_closest_fishing_spots RPC hatası: ${error.message}`,
      );
      // Non-fatal: çağıran taraf boş diziyle devam eder
      return [];
    }

    return data ?? [];
  }
}
