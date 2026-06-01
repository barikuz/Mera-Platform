-- ============================================================
-- get_top_fish
--
-- Av kayitlarina gore en cok yakalanan balik turlerini dondurur.
-- catches tablosunu fish_species ile join eder, tur bazinda
-- av adedini sayar ve azalan siraya gore siralar.
--
-- Parametre:
--   p_limit  integer  Dondurulecek maksimum balik turu sayisi (varsayilan: 10)
--
-- Kullanim (Supabase JS):
--   supabase.rpc('get_top_fish', { p_limit: 5 })
-- ============================================================

CREATE OR REPLACE FUNCTION get_top_fish(
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  name        text,
  catch_count bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    fs.name,
    COUNT(c.species_id) AS catch_count
  FROM catches c
  JOIN fish_species fs ON fs.id = c.species_id
  GROUP BY fs.id, fs.name
  ORDER BY catch_count DESC
  LIMIT p_limit;
$$;
