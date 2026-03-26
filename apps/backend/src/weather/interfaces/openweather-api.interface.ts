/**
 * OpenWeatherApiResponse - OpenWeather API Ham Yanit Yapisi
 *
 * OpenWeather Current Weather API'den donen yanitin tip tanimi.
 * Sadece kullandigimiz alanlar tanimlanmistir.
 *
 * API Docs: https://openweathermap.org/current
 */
export interface OpenWeatherApiResponse {
  main: {
    temp: number; // Sicaklik (metric: Celsius)
    pressure: number; // Atmosfer basinci (hPa)
  };
  wind: {
    speed: number; // Ruzgar hizi (metric: m/s)
  };
  cod: number; // HTTP durum kodu
  message?: string; // Hata mesaji (varsa)
}

/**
 * WeatherData - Donusturulmus Hava Durumu Verisi
 *
 * API'den alinan ham verinin sadelestirilmis hali.
 * Controller ve istemciler bu yapiyi kullanir.
 */
export interface WeatherData {
  temperature: number; // Sicaklik (Celsius)
  windSpeed: number; // Ruzgar hizi (m/s)
  pressure: number; // Basinc (hPa)
}
