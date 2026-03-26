/**
 * WeatherService - Hava Durumu Servisi
 *
 * OpenWeather API'den hava durumu verilerini ceker ve donusturur.
 * Harici API hatalarini yonetir ve uygun NestJS exception'larina cevirir.
 */
import { Injectable, BadGatewayException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OpenWeatherApiResponse,
  WeatherData,
} from './interfaces/openweather-api.interface';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly timeoutMs = 5000; // 5 saniye timeout

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!key) {
      this.logger.error('OPENWEATHER_API_KEY ortam degiskeni bulunamadi!');
    }
    this.apiKey = key ?? '';
  }

  /**
   * Belirtilen koordinatlar icin hava durumu verilerini getirir.
   *
   * @param lat - Enlem degeri
   * @param lon - Boylam degeri
   * @returns WeatherData - Sicaklik, ruzgar hizi ve basinc bilgileri
   * @throws BadGatewayException - API hatasi veya timeout durumunda
   */
  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

    try {
      // AbortController ile timeout yonetimi
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // HTTP hata kontrolu
      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => ({}))) as Partial<OpenWeatherApiResponse>;
        this.logger.error(
          `OpenWeather API hatasi: ${response.status} - ${errorData.message || 'Bilinmeyen hata'}`,
        );
        throw new BadGatewayException(
          'Hava durumu servisi su anda kullanilamiyor',
        );
      }

      const data = (await response.json()) as OpenWeatherApiResponse;

      // Yanit yapisini dogrula
      if (!data.main || !data.wind) {
        this.logger.error('OpenWeather API beklenmeyen yanit formati');
        throw new BadGatewayException(
          'Hava durumu servisi gecersiz yanit dondu',
        );
      }

      // Veriyi donustur ve dondur
      return {
        temperature: data.main.temp,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        safetyWarnings: this.evaluateSafety(data.wind.speed, data.main.temp),
      };
    } catch (error) {
      // Timeout hatasi kontrolu
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.error('OpenWeather API istegi zaman asimina ugradi');
        throw new BadGatewayException(
          'Hava durumu servisi yanit vermedi (timeout)',
        );
      }

      // BadGatewayException zaten firlatilmissa tekrar firlat
      if (error instanceof BadGatewayException) {
        throw error;
      }

      // Beklenmeyen hatalar
      this.logger.error(
        `OpenWeather API beklenmeyen hata: ${(error as Error).message}`,
      );
      throw new BadGatewayException(
        'Hava durumu servisi ile iletisim kurulamadi',
      );
    }
  }

  /**
   * Hava kosullarina gore guvenlik uyarilarini degerlendirir.
   *
   * @param windSpeed - Ruzgar hizi (m/s)
   * @param temp - Sicaklik (Celsius)
   * @returns Uyari mesajlari dizisi
   */
  private evaluateSafety(windSpeed: number, temp: number): string[] {
    const warnings: string[] = [];

    if (windSpeed > 10) {
      warnings.push(
        'Şiddetli Rüzgar! Suya (özellikle tekneyle) açılmak tehlikeli olabilir.',
      );
    }
    if (temp < 5) {
      warnings.push('Aşırı Soğuk! Hipotermi ve buzlanma riskine dikkat edin.');
    }
    if (temp > 35) {
      warnings.push('Kavurucu Sıcak! Güneş çarpması riskine karşı önlem alın.');
    }

    return warnings;
  }
}
