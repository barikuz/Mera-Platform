import { SpotResult, EquipmentResult, TipResult } from "@/types/assistant";

// ─── Mock Spot Recommendation Results ─────────────────────────────────────────

export const MOCK_SPOT_RESULTS: SpotResult[] = [
  {
    spotName: "Hazar Gölü - Gezin Sazlıkları",
    waterType: "Tatlı Su",
    depth: "1m-12m",
    description:
      "Sazlık alanlar sazan balıklarının doğal beslenme ve barınma alanıdır. 23.93°C hava sıcaklığında sığ sular verimlidir.",
    coordinates: { lat: 38.4935, lng: 39.3872 },
  },
  {
    spotName: "Keban Baraj Gölü - Pertek Feribotu Açıkları",
    waterType: "Tatlı Su",
    depth: "3m-20m",
    description:
      "3-20 metre arası derinlik geçişleri, güneşli havalarda sazanın yemlenmek için kıyılamasına olanak sağlar.",
    coordinates: { lat: 38.8691, lng: 39.3218 },
  },
  {
    spotName: "Çırçır Barajı - Mesire Alanı Karşısı",
    waterType: "Tatlı Su",
    depth: "1m-8m",
    description:
      "Düşük derinlikli ve durgun yapısı sayesinde sazan avı için bölgedeki en uygun noktalardan biridir.",
    coordinates: { lat: 38.6112, lng: 39.1843 },
  },
];

// ─── Mock Equipment Results ───────────────────────────────────────────────────

export const MOCK_EQUIPMENT_RESULTS: EquipmentResult[] = [
  {
    category: "Kamış",
    productName: "Shimano Nasci AX 270MH",
    price: 3249,
    expertNote:
      "270cm MH aksiyon, hem shore jigging hem de yemli uygulamalarda çok yönlü kullanım sunar. Levrek için ideal atış mesafesi sağlar.",
  },
  {
    category: "Makine",
    productName: "Daiwa Fuego LT 3000-C",
    price: 4599,
    expertNote:
      "LT (Light & Tough) gövde yapısı gün boyu yorulmadan kullanım sağlar. 3000 numara, Levrek için gereken ipek kapasitesi ve fren gücünü sunar.",
  },
  {
    category: "Yem / Sahte Yem",
    productName: "DUO Tide Minnow 75 Sprint",
    price: 549,
    expertNote:
      "Sığ su Yemli uygulamalarında Levrek için mükemmel. Gerçekçi yüzme aksiyonu ve doğal renk paleti hedef balığı tahrik eder.",
  },
];

// ─── Mock Technique Tips Results ──────────────────────────────────────────────

export const MOCK_TIP_RESULTS: TipResult[] = [
  {
    title: "En Verimli Zaman",
    subtitle: "Şafak ve gün batımı arası rüzgar kırığı kıyılar",
    items: [
      "İlk ışıkta 30-45 dakikalık agresif tarama yap.",
      "Bulutlu havada öğlen penceresi de aktifleşebilir.",
    ],
  },
  {
    title: "Olta Aksiyonu",
    subtitle: "Yavaş-orta retrieve ile düzensiz duraklama",
    items: [
      "3 tur sarıp 2 saniye bekle, ardından sert bir çek yap.",
      "Dip yapıda hissettiğinde anlık gevşet, tekrar sık.",
    ],
  },
  {
    title: "Yem Seçimi",
    subtitle: "Su sıcaklığına göre renk ve boyut ayarı",
    items: [
      "18°C üstü: doğal renkler (yeşil, kahve) tercih et.",
      "18°C altı: parlak ve provokatif renkler (turuncu, sarı) kullan.",
      "Akıntılı bölgelerde ağır jig head ile dibi tara.",
    ],
  },
  {
    title: "Konum Stratejisi",
    subtitle: "Yapısal değişim noktalarını hedefle",
    items: [
      "Kayalık-kumsal geçişleri levrek için birincil avlanma alanıdır.",
      "Liman girişleri ve mendirek köşelerinde akıntı kırılması bul.",
      "Rüzgar altı kıyılarda yem balığı yoğunlaşmasını takip et.",
    ],
  },
];

// ─── Equipment Category Icons (emoji fallback) ───────────────────────────────

export const EQUIPMENT_CATEGORY_ICONS: Record<string, string> = {
  Kamış: "🎣",
  Makine: "⚙️",
  "Yem / Sahte Yem": "🪝",
};

