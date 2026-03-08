# Mera (Web)

"Mera", hem amatör hem de profesyonel balıkçılar için balık tutma deneyimini optimize etmek ve ihtiyaç duydukları ekipmanlara erişim sağlamak amacıyla tasarlanmış bütüncül bir dijital asistan ve e-ticaret platformudur.

## ✨ Temel Özellikler

📍 **Akıllı Nokta Önerileri:** Kullanıcının bölgesine, mevcut mevsime ve hava koşullarına göre en verimli balık tutma yerlerini önerme.

🎣 **Kişiselleştirilmiş Ekipman Tavsiyesi:** Hedef balık türüne ve seçilen noktanın çevresel koşullarına göre özel ekipman önerileri (oltalar, makineler, yemler) sunma.

💡 **İpuçları ve Teknikler:** Günün avlanmak için en iyi zamanı, etkili düğüm çeşitleri ve belirli balıkları çekmek için özel hareketler gibi ava özel ipuçları sunma.

⛅ **Hava Durumu ve Güvenlik Uyarıları:** Planlanan avlak bölgesindeki anlık hava durumu tahminlerini ve balıkçı güvenliğini tehdit edebilecek gerçek zamanlı uyarıları görüntüleme.

📊 **Av İstatistikleri Kaydı:** Avlanan balıkların tür, boyut ve ağırlık gibi verilerini konumuyla birlikte sisteme işleyerek istatistiklerini takip etme.

🗺️ **İnteraktif Mera Keşfi:** Harita üzerinden yeni potansiyel balık tutma noktalarını ve bölge özelliklerini keşfedebilmek için interaktif bir harita.

🛒 **Özel E-Ticaret Mağazası:** Balıkçılık malzemelerinin bulunduğu entegre, tek satıcılı çevrimiçi mağaza.

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel geliştirme ortamınızda çalıştırmak için aşağıdaki adımları izleyin. Proje, frontend (Next.js) ve backend (NestJS) olmak üzere iki ana klasörden oluşmaktadır.

### 🖥️ Ön Yüz (Frontend - Next.js)

1️⃣ Ön yüz dizinine gidin ve bağımlılıkları yükleyin:

```bash
cd apps/web
npm install
```

2️⃣ Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Uygulama varsayılan olarak http://localhost:3000 adresinde çalışacaktır.

### ⚙️ Arka Yüz (Backend - NestJS)

1️⃣ Arka yüz dizinine gidin ve bağımlılıkları yükleyin:

```bash
cd apps/backend
npm install
```

2️⃣ Geliştirme sunucusunu başlatın:

```bash
npm run start:dev
```

API varsayılan olarak http://localhost:3001 (veya `.env` dosyasında belirlediğiniz portta) çalışacaktır.

## 🛠️ Durum

Bu proje aktif olarak geliştirme sürecindedir.
