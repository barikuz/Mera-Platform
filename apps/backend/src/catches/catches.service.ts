import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { WeatherService } from '../weather/weather.service';
import { CreateCatchDto } from './dto/create-catch.dto';
import {
  CatchRecordDto,
  CreateCatchResponseDto,
  GetCatchesResponseDto,
} from './dto/catch-response.dto';

@Injectable()
export class CatchesService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly weatherService: WeatherService,
  ) {}

  async createCatch(
    userId: string,
    createCatchDto: CreateCatchDto,
  ): Promise<CreateCatchResponseDto> {
    const weather = await this.resolveWeather(createCatchDto);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('catches')
      .insert({
        user_id: userId,
        species: createCatchDto.species,
        weight_kg: createCatchDto.weight_kg ?? null,
        length_cm: createCatchDto.length_cm ?? null,
        location_lat: createCatchDto.location_lat ?? null,
        location_lng: createCatchDto.location_lng ?? null,
        weather_temp_c: weather.weather_temp_c,
        weather_pressure_hpa: weather.weather_pressure_hpa,
        weather_wind_speed_kmh: weather.weather_wind_speed_kmh,
      })
      .select('*')
      .single<CatchRecordDto>();

    if (error) {
      throw new InternalServerErrorException(
        `Av kaydi olusturulurken hata olustu: ${error.message}`,
      );
    }

    return {
      message: 'Av kaydi basariyla eklendi',
      data,
    };
  }

  async findAllByUserId(userId: string): Promise<GetCatchesResponseDto> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('catches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(
        `Av kayitlari getirilirken hata olustu: ${error.message}`,
      );
    }

    return {
      message: 'Av kayitlari getirildi',
      data: (data ?? []) as CatchRecordDto[],
    };
  }

  private async resolveWeather(createCatchDto: CreateCatchDto): Promise<{
    weather_temp_c: number | null;
    weather_pressure_hpa: number | null;
    weather_wind_speed_kmh: number | null;
  }> {
    if (
      createCatchDto.location_lat === undefined ||
      createCatchDto.location_lng === undefined
    ) {
      return {
        weather_temp_c: null,
        weather_pressure_hpa: null,
        weather_wind_speed_kmh: null,
      };
    }

    try {
      const weather = await this.weatherService.getWeather(
        createCatchDto.location_lat,
        createCatchDto.location_lng,
      );

      return {
        weather_temp_c: weather.temperature,
        weather_pressure_hpa: weather.pressure,
        weather_wind_speed_kmh: Number((weather.windSpeed * 3.6).toFixed(2)),
      };
    } catch {
      return {
        weather_temp_c: null,
        weather_pressure_hpa: null,
        weather_wind_speed_kmh: null,
      };
    }
  }
}
