export type CreateOrderItemPayload = {
  productId: string;
  quantity: number;
};

export type PaymentCardPayload = {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
};

export type CreateOrderPayload = {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  items: CreateOrderItemPayload[];
  paymentCard: PaymentCardPayload;
};

export type CreateOrderResponse = {
  message: string;
  data: unknown;
  payment: {
    conversationId?: string;
    paymentId?: string;
  };
};
