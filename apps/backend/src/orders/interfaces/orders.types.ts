// Bu dosya, siparis ve iyzico akisi boyunca paylasilan tip tanimlarini merkezi olarak tutar.
export type OrderItem = {
  productId: string;
  quantity: number;
};

// Veritabani tarafinda dogrulanmis urun-fiyat eslesmesini temsil eder.
export type VerifiedProduct = {
  productId: string;
  unitPrice: number;
};

// Kimlik dogrulama katmanindan gelen kullanici baglamini tasir.
export type AuthenticatedOrderUser = {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    surname?: string;
    [key: string]: unknown;
  };
};

// Siparis kaleminin sunucu tarafinda fiyat eklenmis halini temsil eder.
export type PricedOrderItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

// Iyzipay odeme cevabindan uygulamada kullanilan alanlari tipler.
export type IyzipayPaymentResponse = {
  status?: string;
  errorMessage?: string;
  errorCode?: string;
  conversationId?: string;
  paymentId?: string;
};

// create_order_with_items RPC fonksiyonundan donen siparis kaydini temsil eder.
export type CreatedOrderPayload = {
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

// Iyzipay SDK istemcisinin uygulamada ihtiyac duyulan minimal yuzeyini tipler.
export type IyzipayClient = {
  payment: {
    create: (
      payload: Record<string, unknown>,
      callback: (
        error: unknown,
        result: IyzipayPaymentResponse | null | undefined,
      ) => void,
    ) => void;
  };
};

// Iyzipay istemci kurucusunun bekledigi yapilandirma seklini tipler.
export type IyzipayConstructor = new (config: {
  apiKey: string;
  secretKey: string;
  uri: string;
}) => IyzipayClient;

// Iyzipay odeme istegi olusturmak icin gereken tum girdileri bir araya getirir.
export type IyzipayPaymentParams = {
  userId: string;
  totalAmount: number;
  createOrderDto: {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    paymentCard: {
      cardHolderName: string;
      cardNumber: string;
      expireMonth: string;
      expireYear: string;
      cvc: string;
    };
  };
  pricedItems: PricedOrderItem[];
  conversationId: string;
  authUser?: AuthenticatedOrderUser;
  clientIp: string;
};
