-- ============================================================
-- get_top_products
--
-- Siparis gecmisine gore en cok siparis edilen urunleri dondurur.
-- order_items tablosunu products ile join eder, urun bazinda
-- siparis adedini sayar ve azalan siraya gore siralar.
--
-- Parametre:
--   p_limit  integer  Dondurulecek maksimum urun sayisi (varsayilan: 10)
--
-- Kullanim (Supabase JS):
--   supabase.rpc('get_top_products', { p_limit: 5 })
-- ============================================================

CREATE OR REPLACE FUNCTION get_top_products(
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  name        text,
  price       numeric,
  image_url   text,
  order_count bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.name,
    p.price,
    p.image_url,
    COUNT(oi.product_id) AS order_count
  FROM order_items oi
  JOIN products p ON p.id = oi.product_id
  GROUP BY p.id, p.name, p.price, p.image_url
  ORDER BY order_count DESC
  LIMIT p_limit;
$$;
