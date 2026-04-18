import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateOrderDto } from './dto/create-order.dto';

type OrderItem = {
  productId: string;
  quantity: number;
};

type VerifiedProduct = {
  productId: string;
  unitPrice: number;
};

type CreatedOrderPayload = {
  id: string;
  user_id: string;
  total_amount: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

@Injectable()
export class OrdersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    if (!createOrderDto.items.length) {
      throw new BadRequestException('Siparis en az bir urun icermelidir');
    }

    const verifiedProducts = await this.verifyProductPrices(
      createOrderDto.items,
    );
    const verifiedPriceMap = new Map(
      verifiedProducts.map((product) => [product.productId, product.unitPrice]),
    );

    const totalAmount = createOrderDto.items.reduce((sum, item) => {
      const unitPrice = verifiedPriceMap.get(item.productId);

      if (unitPrice === undefined) {
        throw new InternalServerErrorException(
          `Urun dogrulanirken beklenmeyen hata olustu: ${item.productId}`,
        );
      }

      return sum + unitPrice * item.quantity;
    }, 0);

    const orderItems = createOrderDto.items.map((item: OrderItem) => ({
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: verifiedPriceMap.get(item.productId),
    }));

    if (orderItems.some((item) => item.unit_price === undefined)) {
      throw new InternalServerErrorException('Siparis kalemleri hazirlanamadi');
    }

    const rpcResult = (await this.supabaseService
      .getClient()
      .rpc('create_order_with_items', {
        p_user_id: userId,
        p_total_amount: totalAmount,
        p_shipping_name: createOrderDto.shippingName,
        p_shipping_phone: createOrderDto.shippingPhone,
        p_shipping_address: createOrderDto.shippingAddress,
        p_status: 'pending',
        p_items: orderItems,
      })) as {
      data: CreatedOrderPayload | null;
      error: { message: string } | null;
    };

    const { data, error } = rpcResult;

    if (error) {
      throw new InternalServerErrorException(
        `Siparis olusturulurken hata olustu: ${error.message}`,
      );
    }

    return {
      message: 'Siparis basariyla olusturuldu',
      data: data as CreatedOrderPayload,
    };
  }

  private async verifyProductPrices(
    items: OrderItem[],
  ): Promise<VerifiedProduct[]> {
    const uniqueItems = [
      ...new Map(items.map((item) => [item.productId, item])).values(),
    ];

    const verifiedProducts = await Promise.all(
      uniqueItems.map(async (item) => {
        const { data, error } = await this.supabaseService
          .getClient()
          .from('products')
          .select('id, price')
          .eq('id', item.productId)
          .is('deleted_at', null)
          .maybeSingle<{ id: string; price: number | string | null }>();

        if (error) {
          throw new InternalServerErrorException(
            `Urunler dogrulanirken hata olustu: ${error.message}`,
          );
        }

        if (!data) {
          throw new NotFoundException(`Urun bulunamadi: ${item.productId}`);
        }

        if (data.price === null || data.price === undefined) {
          throw new BadRequestException(
            `Urun fiyat bilgisi eksik: ${item.productId}`,
          );
        }

        const unitPrice = Number(data.price);

        if (Number.isNaN(unitPrice)) {
          throw new BadRequestException(
            `Urun fiyat bilgisi gecersiz: ${item.productId}`,
          );
        }

        return {
          productId: data.id,
          unitPrice,
        };
      }),
    );

    return verifiedProducts;
  }
}
