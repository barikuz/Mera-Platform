import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

type ShopRecord = Record<string, unknown>;

@Injectable()
export class ShopService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findActiveCategories(): Promise<ShopRecord[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('categories')
      .select('*')
      .is('deleted_at', null);

    if (error) {
      throw new InternalServerErrorException(
        `Kategoriler getirilirken hata oluştu: ${error.message}`,
      );
    }

    return (data ?? []) as ShopRecord[];
  }

  async findActiveProducts(categoryId?: string): Promise<ShopRecord[]> {
    let query = this.supabaseService
      .getClient()
      .from('products')
      .select('*')
      .is('deleted_at', null);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(
        `Ürünler getirilirken hata oluştu: ${error.message}`,
      );
    }

    return (data ?? []) as ShopRecord[];
  }
}
