/**
 * FishingSpot Entity - Mera Veri Modeli
 *
 * Bu interface, Supabase'deki 'fishing_spots' tablosunun yapısını tanımlar.
 * Tip güvenliği sağlamak için servis katmanında kullanılır.
 *
 * Not: Supabase şeması değişirse bu interface de güncellenmelidir.
 */
export interface FishingSpot {
  // Benzersiz tanımlayıcı (UUID)
  id: string;

  // Meranın adı (zorunlu)
  name: string;

  // Mera hakkında detaylı açıklama
  description?: string;

  // Merkez noktanın enlem değeri (latitude)
  center_lat: number;

  // Merkez noktanın boylam değeri (longitude)
  center_lng: number;

  // Meranın kapsadığı alanın yarıçapı (metre cinsinden)
  radius_meters?: number;

  // Su tipi (örn: "Tatlı Su", "Tuzlu Su")
  water_type: string;

  // Bölgedeki minimum derinlik (metre)
  min_depth?: number;

  // Bölgedeki maksimum derinlik (metre)
  max_depth?: number;

  // Meranın herkese açık olup olmadığı (gizlilik ayarı)
  is_public?: boolean;

  // Kaydın oluşturulma tarihi (ISO 8601 formatında)
  created_at?: string;

  // Kaydın son güncellenme tarihi (ISO 8601 formatında)
  updated_at?: string;
}
