export type CheckoutFormState = {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
};

export const initialCheckoutForm: CheckoutFormState = {
  shippingName: "",
  shippingPhone: "",
  shippingAddress: "",
  cardHolderName: "",
  cardNumber: "",
  expireMonth: "",
  expireYear: "",
  cvc: "",
};
