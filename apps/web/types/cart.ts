export type CartProduct = {
  id: string;
  name: string | null;
  price: number | string | null;
  image_url?: string | null;
};

export type CartItem = CartProduct & {
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addItem: (product: CartProduct) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};
