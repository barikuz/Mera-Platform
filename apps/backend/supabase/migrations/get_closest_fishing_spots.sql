-- ============================================================
-- get_closest_fishing_spots
--
-- Kullanicinin koordinatlarindan (user_lat, user_lng) en yakin
-- `result_limit` adet avlak noktasini dondurur.
--
-- Mesafe hesabi: Haversine formulu (saf SQL, PostGIS gerektirmez).
-- Birim: kilometre.
--
-- Kullanim (Supabase JS):
--   supabase.rpc('get_closest_fishing_spots', {
--     user_lat: 41.01,
--     user_lng: 28.97,
--     result_limit: 3,
--   })
-- ============================================================

CREATE OR REPLACE FUNCTION get_closest_fishing_spots(
  user_lat     double precision,
  user_lng     double precision,
  result_limit integer DEFAULT 3
)
RETURNS TABLE (
  name         text,
  water_type   text,
  min_depth    double precision,
  max_depth    double precision,
  center_lat   double precision,
  center_lng   double precision,
  distance_km  double precision
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    fs.name,
    fs.water_type,
    fs.min_depth::double precision,
    fs.max_depth::double precision,
    fs.center_lat::double precision,
    fs.center_lng::double precision,
    -- Haversine formulu
    (
      2 * 6371 * asin(
        sqrt(
          pow(sin(radians(fs.center_lat - user_lat) / 2), 2)
          + cos(radians(user_lat))
          * cos(radians(fs.center_lat))
          * pow(sin(radians(fs.center_lng - user_lng) / 2), 2)
        )
      )
    ) AS distance_km
  FROM fishing_spots fs
  ORDER BY distance_km ASC
  LIMIT result_limit;
$$;
