import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IyzipayService } from '../iyzipay/iyzipay.service.js';
import { SupabaseService } from '../supabase/supabase.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import {
  AuthenticatedOrderUser,
  CreatedOrderPayload,
  OrderItem,
  VerifiedProduct,
} from './interfaces/orders.types.js';

// Bu servis, siparis olusturma akisini orkestre eder: fiyat dogrulama, odeme ve RPC kaydi.
@Injectable()
export class OrdersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly iyzipayService: IyzipayService,
  ) {}

  // Siparis istegini uctan uca yonetir ve yalnizca odeme basariliysa kayit olusturur.
  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
    authUser?: AuthenticatedOrderUser,
    clientIp = '127.0.0.1',
  ) {
    if (!createOrderDto.items.length) {
      throw new BadRequestException('Siparis en az bir urun icermelidir');
    }

    const verifiedProducts = await this.verifyProductPrices(
      createOrderDto.items,
    );
    const verifiedPriceMap = new Map(
      verifiedProducts.map((product) => [product.productId, product.unitPrice]),
    );

    const pricedItems = createOrderDto.items.map((item: OrderItem) => {
      const unitPrice = verifiedPriceMap.get(item.productId);

      if (unitPrice === undefined) {
        throw new InternalServerErrorException(
          `Urun dogrulanirken beklenmeyen hata olustu: ${item.productId}`,
        );
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
      };
    });

    const totalAmount = pricedItems.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0);

    const orderItems = pricedItems.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }));

    if (orderItems.some((item) => item.unit_price === undefined)) {
      throw new InternalServerErrorException('Siparis kalemleri hazirlanamadi');
    }

    const conversationId = randomUUID();
    const paymentResponse = await this.iyzipayService.createIyzipayPayment({
      userId,
      totalAmount,
      createOrderDto,
      pricedItems,
      conversationId,
      authUser,
      clientIp,
    });

    if (paymentResponse.status !== 'success') {
      const errorMessage =
        paymentResponse.errorMessage ||
        paymentResponse.errorCode ||
        'Odeme islemi basarisiz oldu';

      throw new BadRequestException(errorMessage);
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
      payment: {
        conversationId,
        paymentId: paymentResponse.paymentId,
      },
    };
  }

  // Urun fiyatlarini veritabanindan dogrular ve sunucu tarafi fiyat kaynagini olusturur.
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
