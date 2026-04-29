/**
 * CatalogService - Katalog Servisi
 *
 * Bu servis, balık türleri ve avlanma stilleri gibi referans verilerini
 * veritabanından sorgular. Tüm sorgulamalar salt okunurdur (read-only).
 */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface CatalogItem {
  id: string;
  name: string;
}

@Injectable()
export class CatalogService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Generic method to fetch catalog items from any table.
   * Queries only id and name columns.
   *
   * @param tableName - Name of the table to query
   * @returns Array of catalog items
   * @throws InternalServerErrorException - If database query fails
   */
  private async getFromTable(tableName: string): Promise<CatalogItem[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from(tableName)
        .select('id, name');

      if (error) {
        throw new InternalServerErrorException(
          `${tableName} alınamadı: ${error.message}`,
        );
      }

      return data || [];
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `${tableName} alınırken beklenmedik bir hata oluştu`,
      );
    }
  }

  /**
   * Tüm balık türlerini getirir.
   * Veritabanında sadece id ve name sütunlarını sorgular.
   *
   * @returns Balık türleri dizisi
   * @throws InternalServerErrorException - Veritabanı sorgusu başarısız olursa
   */
  async getFishSpecies(): Promise<CatalogItem[]> {
    return this.getFromTable('fish_species');
  }

  /**
   * Tüm avlanma stillerini getirir.
   * Veritabanında sadece id ve name sütunlarını sorgular.
   *
   * @returns Avlanma stilleri dizisi
   * @throws InternalServerErrorException - Veritabanı sorgusu başarısız olursa
   */
  async getFishingStyles(): Promise<CatalogItem[]> {
    return this.getFromTable('fishing_styles');
  }
}
