import { ApiProperty } from '@nestjs/swagger';

export class SpotCoordinatesDto {
  @ApiProperty({
    description: 'Latitude degeri',
    example: 38.8,
  })
  lat!: number;

  @ApiProperty({
    description: 'Longitude degeri',
    example: 38.7,
  })
  lng!: number;
}

export class SpotRecommendationItemDto {
  @ApiProperty({
    description: 'Mera adi',
    example: 'Keban Baraj Golu',
  })
  meraAdi!: string;

  @ApiProperty({
    description: 'Su tipi',
    example: 'Tatli Su',
  })
  suTipi!: string;

  @ApiProperty({
    description: 'Derinlik araligi',
    example: '2m-15m',
  })
  derinlik!: string;

  @ApiProperty({
    description: 'Kisa aciklama',
    example:
      'Sabah saatlerinde yuzeye yakin sular, hedef balik icin daha uygun olabilir.',
  })
  aciklama!: string;

  @ApiProperty({
    description: 'Koordinat bilgisi',
    type: SpotCoordinatesDto,
  })
  koordinat!: SpotCoordinatesDto;
}

export class SpotRecommendationResponseDto {
  @ApiProperty({
    description: 'Onerilen meralar listesi',
    type: [SpotRecommendationItemDto],
  })
  onerilen_meralar!: SpotRecommendationItemDto[];
}

export class GearRecommendationItemDto {
  @ApiProperty({
    description: 'Urun kimligi',
    example: 'a3f1c2d4-5b6e-7f80-91a2-b3c4d5e6f789',
  })
  productId!: string;

  @ApiProperty({
    description: 'Kamis, Makine, Yem veya Sahte Yem olmali',
    example: 'Kamis',
  })
  kategori!: string;

  @ApiProperty({
    description: 'Urun adi',
    example: 'Shimano Nasci AX 270MH',
  })
  urunAdi!: string;

  @ApiProperty({
    description: 'Urun fiyati',
    example: 3249,
  })
  fiyat!: number;

  @ApiProperty({
    description: 'Uzman notu',
    example:
      '270cm boyu ve orta sertligi, hedef balik icin dengeli atis ve kontrol saglar.',
  })
  uzmanNotu!: string;
}

export class GearRecommendationResponseDto {
  @ApiProperty({
    description:
      'Her zaman tam olarak 3 urun (Kamis, Makine, Yem) icermelidir.',
    type: [GearRecommendationItemDto],
  })
  onerilen_set!: GearRecommendationItemDto[];
}

export class TechnicalTipDto {
  @ApiProperty({
    description: 'Kartin ana basligi',
    example: 'En Verimli Zaman',
  })
  baslik!: string;

  @ApiProperty({
    description: 'Kisa ozet metin',
    example: 'Safak ve gun batimi arasi ruzgar kirigi kiyilar',
  })
  altBaslik!: string;

  @ApiProperty({
    description: 'Maddelendirilmis tavsiyeler',
    example: [
      'Ilk isikta 30-45 dakikalik agresif tarama yap.',
      'Bulutlu havada oglen penceresi de aktiflesebilir.',
    ],
    type: [String],
  })
  maddeler!: string[];
}

export class TechnicalTipsResponseDto {
  @ApiProperty({
    description: 'Her zaman 4 kategori icermelidir',
    type: [TechnicalTipDto],
  })
  taktikler!: TechnicalTipDto[];
}
