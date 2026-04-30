import { Type } from '@google/genai';

export const spotRecommendationResponseSchema = {
  type: Type.OBJECT,
  properties: {
    onerilen_meralar: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          meraAdi: { type: Type.STRING },
          suTipi: { type: Type.STRING },
          derinlik: { type: Type.STRING },
          aciklama: { type: Type.STRING },
          koordinat: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
            },
            required: ['lat', 'lng'],
          },
        },
        required: ['meraAdi', 'suTipi', 'derinlik', 'aciklama', 'koordinat'],
      },
    },
  },
  required: ['onerilen_meralar'],
};

export const gearRecommendationResponseSchema = {
  type: Type.OBJECT,
  properties: {
    onerilen_set: {
      type: Type.ARRAY,
      description:
        'Her zaman tam olarak 3 urun (Kamis, Makine, Yem) icermelidir.',
      items: {
        type: Type.OBJECT,
        properties: {
          productId: { type: Type.STRING },
          kategori: {
            type: Type.STRING,
            description: 'Kamis, Makine, Yem veya Sahte Yem olmali.',
          },
          urunAdi: { type: Type.STRING },
          fiyat: {
            type: Type.NUMBER,
            description: 'Sadece rakamsal deger.',
          },
          uzmanNotu: { type: Type.STRING },
        },
        required: ['productId', 'kategori', 'urunAdi', 'fiyat', 'uzmanNotu'],
      },
    },
  },
  required: ['onerilen_set'],
};

export const technicalTipsResponseSchema = {
  type: Type.OBJECT,
  properties: {
    taktikler: {
      type: Type.ARRAY,
      description:
        'Always return 4 objects in this exact order: 1. En Verimli Zaman, 2. Olta Aksiyonu, 3. Ideal Dugum ve Takim, 4. Uzman Ipucu.',
      items: {
        type: Type.OBJECT,
        properties: {
          baslik: {
            type: Type.STRING,
            description:
              'Kartin ana basligi (Orn: En Verimli Zaman, Olta Aksiyonu)',
          },
          altBaslik: {
            type: Type.STRING,
            description: 'Kartin hemen altindaki kisa ozet metin.',
          },
          maddeler: {
            type: Type.ARRAY,
            description:
              'Maddelendirilmis tavsiyeler. Uzman Ipucu kategorisi icin bu liste bos olabilir.',
            items: { type: Type.STRING },
          },
        },
        required: ['baslik', 'altBaslik', 'maddeler'],
      },
    },
  },
  required: ['taktikler'],
};
