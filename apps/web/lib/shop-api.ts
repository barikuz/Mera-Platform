const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export type ShopCategory = {
  id: string;
  name: string | null;
};

export type ShopProduct = {
  id: string;
  name: string | null;
  price: number | string | null;
  category_id: string | null;
  /** Present when Supabase row includes an image column */
  image_url?: string | null;
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      text ? `Mağaza isteği başarısız (${response.status}): ${text}` : `Mağaza isteği başarısız (${response.status})`
    );
  }
  return response.json() as Promise<T>;
}

export async function fetchShopCategories(): Promise<ShopCategory[]> {
  const response = await fetch(`${API_BASE}/shop/categories`);
  return parseJsonResponse<ShopCategory[]>(response);
}

export async function fetchShopProducts(categoryId?: string): Promise<ShopProduct[]> {
  const url = new URL(`${API_BASE}/shop/products`);
  if (categoryId) {
    url.searchParams.set("categoryId", categoryId);
  }
  const response = await fetch(url.toString());
  return parseJsonResponse<ShopProduct[]>(response);
}
