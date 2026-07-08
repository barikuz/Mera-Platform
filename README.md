# Mera Platform

**Mera**, hem amatör hem de profesyonel balıkçılar için balık tutma deneyimini optimize etmek ve ihtiyaç duydukları ekipmanlara erişim sağlamak amacıyla tasarlanmış, yapay zeka destekli bir dijital balıkçılık asistanı ve e-ticaret platformudur.

Bu monorepo, platformun **web ön yüzünü** (Next.js) ve **arka uç API'sini** (NestJS) npm workspaces altında birlikte barındırır.

---

## ✨ Temel Özellikler

| Özellik                                     | Açıklama                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 📍 **Akıllı Nokta Önerileri**               | Kullanıcının bölgesine, mevsime ve hava koşullarına göre en verimli balık tutma yerlerini Gemini AI ile önerir.            |
| 🎣 **Kişiselleştirilmiş Ekipman Tavsiyesi** | Hedef balık türüne, avlak noktasına ve avlanma stiline göre mağaza stoklarından en uygun 3 parçalı ekipman seti oluşturur. |
| 💡 **İpuçları ve Teknikler**                | Avlanma zamanı, olta aksiyonu, düğüm/takım ve uzman ipucu olmak üzere 4 kategori altında AI destekli taktik rehberi sunar. |
| ⛅ **Hava Durumu ve Güvenlik Uyarıları**    | Avlak bölgesindeki anlık hava durumu ve balıkçı güvenliğini tehdit edebilecek gerçek zamanlı uyarıları gösterir.           |
| 📊 **Av İstatistikleri Kaydı**              | Yakalanan balıkların tür, boyut, ağırlık ve konum verilerini kaydederek kişisel istatistik paneli sunar.                   |
| 🗺️ **İnteraktif Mera Keşfi**                | Google Maps üzerinden balık tutma noktalarını harita üzerinde keşfetme ve hava durumu detaylarını görüntüleme.             |
| 🛒 **E-Ticaret Mağazası**                   | Kategorilere göre filtrelenebilir, sepet yönetimli ve iyzico ödeme entegrasyonlu tek satıcılı balıkçılık mağazası.         |
| 🌙 **Koyu / Açık Mod**                      | Sistem tercihi veya kullanıcı seçimine göre otomatik tema desteği.                                                         |

---

## 🏗️ Mimari ve Proje Yapısı

Proje, npm workspaces ile yönetilen bir **monorepo** yapısındadır:

```
Mera-Platform/
├── apps/
│   ├── web/             # Next.js 16 (React 19) — Web ön yüzü
│   └── backend/         # NestJS 11 — REST API arka ucu
├── packages/
│   ├── database/        # Supabase migrations
│   └── shared/          # Paylaşılan tip ve yardımcılar (@mera/shared)
├── cloudbuild-web.yaml      # Web Cloud Build pipeline
├── cloudbuild-backend.yaml  # Backend Cloud Build pipeline
├── package.json             # Root workspace manifest
└── .dockerignore
```

### Web Sayfaları (Next.js App Router)

| Rota         | Sayfa                                                                     |
| ------------ | ------------------------------------------------------------------------- |
| `/`          | Ana Sayfa (Landing & Dashboard)                                           |
| `/login`     | Giriş                                                                     |
| `/register`  | Kayıt                                                                     |
| `/assistant` | AI Asistan (Mera Önerisi, Ekipman Tavsiyesi, Teknik İpuçları, Mera Keşfi) |
| `/store`     | Mağaza (Ürün kataloğu)                                                    |
| `/checkout`  | Ödeme                                                                     |
| `/orders`    | Siparişlerim                                                              |
| `/profile`   | Profil, Av İstatistikleri ve Av Kaydı Ekleme                              |

### Backend Modülleri (NestJS)

| Modül           | Sorumluluk                                                           |
| --------------- | -------------------------------------------------------------------- |
| `profiles`      | Kullanıcı profil yönetimi                                            |
| `fishing-spots` | Balık tutma noktaları (CRUD, harita verileri)                        |
| `weather`       | OpenWeather API entegrasyonu                                         |
| `ai`            | Google Gemini API (Mera Önerisi, Ekipman Tavsiyesi, Teknik İpuçları) |
| `shop`          | Ürün ve kategori yönetimi                                            |
| `catalog`       | Mağaza katalog sorguları                                             |
| `orders`        | Sipariş oluşturma ve takip                                           |
| `iyzipay`       | iyzico ödeme entegrasyonu                                            |
| `catches`       | Av kaydı ve istatistik                                               |
| `supabase`      | Supabase istemci modülü                                              |

---

## 🛠️ Teknoloji Yığını

### Ön Yüz (Frontend)

- **[Next.js 16](https://nextjs.org/)** — App Router, SSR, standalone output
- **[Tailwind CSS 4](https://tailwindcss.com/)**
- **[Tanstack React Query](https://tanstack.com/query)** — Veri çekme, önbellekleme ve persist
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Sepet durumu yönetimi
- **[Recharts](https://recharts.org/)** — Av istatistikleri grafikleri
- **[Radix UI](https://www.radix-ui.com/)** — Dialog, Slot gibi headless bileşenler
- **[Lucide React](https://lucide.dev/)** — İkon seti
- **[Google Fonts](https://fonts.google.com/)** — Inter (gövde), Comfortaa (marka yazı tipi)

### Arka Uç (Backend)

- **[NestJS 11](https://nestjs.com/)** — Modüler REST API

### Veritabanı ve Altyapı

- **[Supabase](https://supabase.com/)** — PostgreSQL, Auth, Storage
- **[OpenWeather API](https://openweathermap.org/api/one-call-3)** — One Call API 3.0 (hiper-yerel hava durumu)
- **[Google Maps Platform](https://developers.google.com/maps)** — Maps JavaScript API
- **[Google Gemini API](https://ai.google.dev/)** — Yapay zeka motoru
- **[iyzico](https://dev.iyzipay.com/)** — Ödeme altyapısı

### Dağıtım (Deployment)

- **[Docker](https://www.docker.com/)** — Çok aşamalı (multi-stage) konteyner imajları (Node 22 Alpine)
- **[Google Cloud Build](https://cloud.google.com/build)** — CI/CD pipeline
- **[Google Cloud Run](https://cloud.google.com/run)** — Sunucusuz konteyner çalıştırma (`europe-west3`)

---

## 🚀 Kurulum ve Çalıştırma

### 1. Depoyu klonlayın

```bash
git clone https://github.com/barikuz/Mera-Platform.git
cd Mera-Platform
```

### 2. Kök bağımlılıkları yükleyin

Tüm workspace bağımlılıkları kök dizinden tek seferde yüklenir:

```bash
npm install
```

### 3. Ortam değişkenlerini yapılandırın

Her iki uygulama için `.env.example` dosyalarını kopyalayıp doldurun:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/backend/.env.example apps/backend/.env
```

### 4. Backend'i başlatın

```bash
npm run start:dev --workspace=apps/backend
```

API varsayılan olarak **http://localhost:3001** adresinde çalışır.
Swagger dökümantasyonuna **http://localhost:3001/api/docs** adresinden erişilebilir (yalnızca geliştirme ortamında).

### 5. Frontend'i başlatın

```bash
npm run dev --workspace=apps/web
```

Web uygulaması varsayılan olarak **http://localhost:3000** adresinde çalışır.

---

## 🐳 Docker ve Dağıtım

Her iki uygulama da çok aşamalı (multi-stage) Dockerfile'lara sahiptir ve **Google Cloud Build** ile **Google Cloud Run** (`europe-west3`) üzerine dağıtılır.

### Docker ile Yerel Derleme

```bash
# Web
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=<değer> \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=<değer> \
  --build-arg NEXT_PUBLIC_API_BASE_URL=<değer> \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<değer> \
  -t mera-web .

# Backend
docker build -f apps/backend/Dockerfile -t mera-backend .
```

### Cloud Build ile Dağıtım

```bash
# Web dağıtımı
gcloud builds submit \
  --config=cloudbuild-web.yaml \
  --substitutions=_NEXT_PUBLIC_SUPABASE_URL="...",_NEXT_PUBLIC_SUPABASE_ANON_KEY="...",_NEXT_PUBLIC_API_BASE_URL="...",_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."

# Backend dağıtımı
gcloud builds submit --config=cloudbuild-backend.yaml
```

> **Not:** Backend ortam değişkenleri Cloud Run servis ayarlarında (Secret Manager veya environment variables) tanımlanmalıdır. Web için `NEXT_PUBLIC_*` değişkenleri Cloud Build substitution'ları üzerinden derleme zamanında enjekte edilir.

### Altyapı Detayları

- **Konteyner Base İmajı:** `node:22-alpine`
- **Web Output Modu:** `standalone` (Next.js — küçük imaj boyutu)
- **Web Port:** `8080` (Cloud Run tarafından `PORT` env var ile sağlanır)
- **Backend Port:** `8080` (Cloud Run tarafından `PORT` env var ile sağlanır), yerel geliştirmede `3001`
- **Güvenlik:** Her iki konteyner de root olmayan kullanıcı (`nextjs` / `nestjs`) ile çalışır

---

## 📄 Veritabanı Şeması

Supabase PostgreSQL üzerinde yönetilen tablolar:

| Tablo            | Açıklama                                               |
| ---------------- | ------------------------------------------------------ |
| `profiles`       | Kullanıcı profilleri (auth.users'a FK)                 |
| `fishing_spots`  | Balık tutma noktaları (koordinat, su tipi, derinlik)   |
| `fish_species`   | Balık türleri referans tablosu                         |
| `fishing_styles` | Avlanma stilleri referans tablosu                      |
| `categories`     | Mağaza ürün kategorileri                               |
| `products`       | Mağaza ürünleri (fiyat, stok, görsel)                  |
| `orders`         | Siparişler (teslimat ve ödeme bilgileri)               |
| `order_items`    | Sipariş kalemleri (ürün, miktar, birim fiyat)          |
| `catches`        | Av kayıtları (tür, boyut, ağırlık, konum, hava durumu) |

> Detaylı veritabanı tasarımı, tablo ilişkileri ve tasarım kararları için bkz. [Mera (Web) Dökümantasyon.md](<Mera%20(Web)%20Dökümantasyon.md>).

---

## 🤖 Yapay Zeka Stratejisi

AI modülleri **Bağlam Enjeksiyonu (Context Injection)** yaklaşımını kullanır: gerçek veriler (hava durumu, mera listesi, mağaza stokları) backend tarafında toplanıp Gemini API'ye yapılandırılmış bir prompt olarak iletilir. Gemini, `responseSchema` ile zorunlu JSON şemasına uygun yanıt döner, böylece halüsinasyon riski minimize edilir.

3 AI modülü:

1. **Mera Önerisi** — Hava + hedef balık + mera verisi → önerilen avlak noktaları
2. **Ekipman Tavsiyesi** — Hedef balık + mera + stil + stoklar → 3 parçalı set (Kamış, Makine, Yem)
3. **Teknik İpuçları** — Hedef balık + mera + hava → 4 kategorili taktik rehberi

---

## 📚 Ek Dökümantasyon

| Belge                                                                 | İçerik                                                                                                             |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [Mera (Web) Dökümantasyon.pdf](<Mera%20(Web)%20Dökümantasyon.md>)     | Web platform dökümantasyonu, kullanıcı senaryoları, veritabanı tasarımı, Gemini prompt stratejisi, UI/UX ekranları |
| [Mera (Mobil) Dökümantasyon.pdf](<Mera%20(Mobil)%20Dökümantasyon.md>) | Mobil uygulama (Expo/React Native) dökümantasyonu                                                                  |
| [İş Paketleri.pdf](İş%20Paketleri.md)                                 | Haftalık iş paketleri ve kilometre taşları                                                                         |

---

## 📝 Lisans

Bu proje özel bir lisans altındadır (UNLICENSED).
