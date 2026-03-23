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
} from '@nestjs/common';
import { CreateFishingSpotDto } from './dto/create-fishing-spot.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { FishingSpot } from './entities/fishing-spot.entity';

@Injectable()
export class FishingSpotsService {
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
}
