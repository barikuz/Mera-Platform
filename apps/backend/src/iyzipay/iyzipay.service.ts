import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Iyzipay from 'iyzipay';
import {
  IyzipayClient,
  IyzipayConstructor,
  IyzipayPaymentParams,
  IyzipayPaymentResponse,
} from '../orders/interfaces/orders.types';

// Bu servis, iyzico odeme istegini kurma ve iyzico API cagrisini gercekleme sorumlulugunu tasir.
@Injectable()
export class IyzipayService {
  constructor(private readonly configService: ConfigService) {}

  // Siparis baglamindan iyzico odeme payload'ini uretir, odemeyi baslatir ve sonucu dondurur.
  async createIyzipayPayment(
    params: IyzipayPaymentParams,
  ): Promise<IyzipayPaymentResponse> {
    const iyzipayClient = this.getIyzipayClient();
    const { createOrderDto, totalAmount, userId, pricedItems } = params;

    const userMetadata = params.authUser?.user_metadata;
    const fullNameSource =
      userMetadata?.full_name ||
      [userMetadata?.name, userMetadata?.surname].filter(Boolean).join(' ') ||
      createOrderDto.shippingName;
    const nameParts = fullNameSource.trim().split(/\s+/);
    const buyerName = nameParts[0] || 'Mera';
    const buyerSurname = nameParts.slice(1).join(' ') || 'User';
    const now = this.formatIyzipayDate(new Date());
    const totalPrice = totalAmount.toFixed(2);

    const paymentRequest: Record<string, unknown> = {
      locale: 'tr',
      conversationId: params.conversationId,
      price: totalPrice,
      paidPrice: totalPrice,
      currency: 'TRY',
      installment: '1',
      basketId: params.conversationId,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: createOrderDto.paymentCard.cardHolderName,
        cardNumber: createOrderDto.paymentCard.cardNumber,
        expireMonth: createOrderDto.paymentCard.expireMonth,
        expireYear: createOrderDto.paymentCard.expireYear,
        cvc: createOrderDto.paymentCard.cvc,
        registerCard: '0',
      },
      buyer: {
        id: userId,
        name: buyerName,
        surname: buyerSurname,
        gsmNumber: params.authUser?.phone || createOrderDto.shippingPhone,
        email: params.authUser?.email || 'sandbox-user@mera.local',
        identityNumber: '11111111111',
        lastLoginDate: now,
        registrationDate: now,
        registrationAddress: createOrderDto.shippingAddress,
        ip: params.clientIp,
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34000',
      },
      shippingAddress: {
        contactName: createOrderDto.shippingName,
        city: 'Istanbul',
        country: 'Turkey',
        address: createOrderDto.shippingAddress,
        zipCode: '34000',
      },
      billingAddress: {
        contactName: createOrderDto.shippingName,
        city: 'Istanbul',
        country: 'Turkey',
        address: createOrderDto.shippingAddress,
        zipCode: '34000',
      },
      basketItems: pricedItems.map((item) => ({
        id: item.productId,
        name: `Product-${item.productId.slice(0, 8)}`,
        category1: 'Mera',
        itemType: 'PHYSICAL',
        price: (item.unitPrice * item.quantity).toFixed(2),
      })),
    };

    try {
      const payment = await new Promise<IyzipayPaymentResponse>(
        (resolve, reject) => {
          iyzipayClient.payment.create(
            paymentRequest,
            (
              error: unknown,
              result: IyzipayPaymentResponse | null | undefined,
            ) => {
              if (error) {
                reject(
                  new InternalServerErrorException(
                    'Iyzipay odeme servisine baglanirken hata olustu',
                  ),
                );
                return;
              }

              resolve(result ?? {});
            },
          );
        },
      );

      return payment;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Odeme islemi sirasinda beklenmeyen hata olustu',
      );
    }
  }

  // Iyzipay istemcisini ortam degiskenlerinden gelen kimlik bilgileriyle olusturur.
  private getIyzipayClient(): IyzipayClient {
    const apiKey = this.configService.get<string>('IYZICO_API_KEY');
    const secretKey = this.configService.get<string>('IYZICO_SECRET_KEY');
    const baseUrl =
      this.configService.get<string>('IYZICO_BASE_URL') ||
      this.configService.get<string>('IYZICO_BASE_URI') ||
      'https://sandbox-api.iyzipay.com';

    if (!apiKey || !secretKey) {
      throw new InternalServerErrorException(
        'Iyzipay ayarlari eksik. IYZICO_API_KEY ve IYZICO_SECRET_KEY tanimlanmalidir',
      );
    }

    const IyzipayClient = Iyzipay as unknown as IyzipayConstructor;

    return new IyzipayClient({
      apiKey,
      secretKey,
      uri: baseUrl,
    });
  }

  // Iyzipay'in bekledigi tarih-saat formatina donusum yapar.
  private formatIyzipayDate(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
