export const mockFishingSpots = [
  {
    meraAdi: 'Keban Baraj Golu',
    suTipi: 'Tatli Su',
    derinlik: '2m-15m',
    koordinat: { lat: 38.8, lng: 38.7 },
    notlar: 'Sakin koyler ve sabah saatlerinde yuzey aktivitesi gorulur.',
  },
  {
    meraAdi: 'Hirfanli Baraji',
    suTipi: 'Tatli Su',
    derinlik: '3m-18m',
    koordinat: { lat: 39.2, lng: 33.5 },
    notlar: 'Ruzgarli gunlerde kiyidan uzaklasan balik hareketi gozlenir.',
  },
  {
    meraAdi: 'Mogan Golu',
    suTipi: 'Tatli Su',
    derinlik: '1m-6m',
    koordinat: { lat: 39.77, lng: 32.79 },
    notlar: 'Sig bolgeler isinan havalarda daha aktif olabilir.',
  },
];

export const mockWeather = {
  temperatureC: 18,
  windSpeedMps: 4.2,
  pressureHpa: 1012,
  conditions: 'partly cloudy',
};

export const mockGearStock = {
  rods: [
    { urunAdi: 'Shimano Nasci AX 270MH', fiyat: 3249 },
    { urunAdi: 'Okuma Alaris 270cm', fiyat: 1850 },
  ],
  reels: [
    { urunAdi: 'Daiwa Fuego LT 3000-C', fiyat: 4599 },
    { urunAdi: 'Shimano Catana 4000', fiyat: 2100 },
  ],
  baits: [
    { urunAdi: 'DUO Tide Minnow 75 Sprint', fiyat: 549 },
    { urunAdi: 'Savage Gear Sandeel', fiyat: 320 },
  ],
};
