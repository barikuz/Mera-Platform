/**
 * AiService - Gemini AI entegrasyonu
 *
 * Uc AI modulunu Gemini API ile cagirir ve JSON yanitlarini dogrular.
 */
import {
  BadGatewayException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { SupabaseService } from '../supabase/supabase.service';
import { WeatherService } from '../weather/weather.service';
import {
  FishingSpotsService,
  SupabaseFishingSpotRow,
} from '../fishing-spots/fishing-spots.service';
import {
  GEAR_RECOMMENDATION_SYSTEM_PROMPT,
  SPOT_RECOMMENDATION_SYSTEM_PROMPT,
  TECHNICAL_TIPS_SYSTEM_PROMPT,
  FISHING_CONDITIONS_SYSTEM_PROMPT,
  buildGearRecommendationUserPrompt,
  buildSpotRecommendationUserPrompt,
  buildTechnicalTipsUserPrompt,
  buildFishingConditionsUserPrompt,
  FishingConditionsWeatherContext,
  PromptGearStock,
  PromptFishingSpot,
} from './ai.prompts';
import {
  gearRecommendationResponseSchema,
  spotRecommendationResponseSchema,
  technicalTipsResponseSchema,
  fishingConditionsResponseSchema,
} from './ai.schemas';
import {
  GearRecommendationResponseDto,
  SpotRecommendationResponseDto,
  TechnicalTipsResponseDto,
} from './dto/ai-response.dto';
import {
  FishingConditionsRequestDto,
  FishingConditionsResponseDto,
} from './dto/fishing-conditions.dto';
import { GearRecommendationRequestDto } from './dto/gear-recommendation.dto';
import { SpotRecommendationRequestDto } from './dto/spot-recommendation.dto';
import { TechnicalTipsRequestDto } from './dto/technical-tips.dto';

type ResponseSchema = Record<string, unknown>;

type SupabaseCategoryRow = {
  id: string;
  name: string | null;
};

type SupabaseProductRow = {
  id: string;
  category_id: string | null;
  name: string | null;
  price: number | string | null;
};

/** Cache key prefix for fishing-condition AI results */
const FISHING_CONDITIONS_CACHE_PREFIX = 'fishing_conditions_ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly genAI: GoogleGenAI;
  private readonly modelName = 'gemini-3-flash-preview';
  private readonly cacheManager: Cache;

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
    private readonly weatherService: WeatherService,
    private readonly fishingSpotsService: FishingSpotsService,
    // Typed as `object` so TypeScript can emit runtime metadata with isolatedModules.
    // Cache is a pure interface and has no runtime value to emit.
    @Inject(CACHE_MANAGER) cacheManager: object,
  ) {
    this.cacheManager = cacheManager as Cache;
    const key = this.configService.get<string>('GEMINI_API_KEY');
    if (!key) {
      this.logger.error('GEMINI_API_KEY ortam degiskeni bulunamadi!');
    }
    this.apiKey = key ?? '';
    this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async getSpotRecommendation(
    body: SpotRecommendationRequestDto,
  ): Promise<SpotRecommendationResponseDto> {
    const [spots, weather] = await Promise.all([
      this.fetchFishingSpots(),
      this.weatherService.getWeatherForPrompt(
        body.coordinates.lat,
        body.coordinates.lng,
      ),
    ]);

    const userPrompt = buildSpotRecommendationUserPrompt(body, weather, spots);
    return this.generateJsonResponse<SpotRecommendationResponseDto>(
      SPOT_RECOMMENDATION_SYSTEM_PROMPT,
      userPrompt,
      spotRecommendationResponseSchema,
    );
  }

  async getGearRecommendation(
    body: GearRecommendationRequestDto,
  ): Promise<GearRecommendationResponseDto> {
    const [stock, weather] = await Promise.all([
      this.fetchGearStock(),
      this.weatherService.getWeatherForPrompt(
        body.coordinates.lat,
        body.coordinates.lng,
      ),
    ]);

    const userPrompt = buildGearRecommendationUserPrompt(body, weather, stock);
    return this.generateJsonResponse<GearRecommendationResponseDto>(
      GEAR_RECOMMENDATION_SYSTEM_PROMPT,
      userPrompt,
      gearRecommendationResponseSchema,
    );
  }

  async getTechnicalTips(
    body: TechnicalTipsRequestDto,
  ): Promise<TechnicalTipsResponseDto> {
    const weather = await this.weatherService.getWeatherForPrompt(
      body.coordinates.lat,
      body.coordinates.lng,
    );
    const userPrompt = buildTechnicalTipsUserPrompt(body, weather);
    return this.generateJsonResponse<TechnicalTipsResponseDto>(
      TECHNICAL_TIPS_SYSTEM_PROMPT,
      userPrompt,
      technicalTipsResponseSchema,
    );
  }

  async getFishingConditions(
    body: FishingConditionsRequestDto,
  ): Promise<FishingConditionsResponseDto> {
    // 1. Find the 3 closest fishing spots from the database (delegated to FishingSpotsService)
    const closestSpots = await this.fishingSpotsService.fetchClosestSpots(
      body.userLat,
      body.userLng,
      3,
    );

    // 2. Determine which coordinates to fetch weather for.
    //    If no spots found, fall back to the user's own coordinates.
    const weatherTargets =
      closestSpots.length > 0
        ? closestSpots.map((s) => ({
            name: s.name,
            lat: Number(s.center_lat),
            lng: Number(s.center_lng),
          }))
        : [{ name: 'Konumunuz', lat: body.userLat, lng: body.userLng }];

    // 3. Fetch weather for all targets in parallel
    const weatherResults = await Promise.all(
      weatherTargets.map((target) =>
        this.weatherService
          .getWeatherForPrompt(target.lat, target.lng)
          .then((w) => ({ ...w, spotName: target.name })),
      ),
    );

    // 4. Build weather contexts for the Gemini prompt
    const weatherContexts: FishingConditionsWeatherContext[] =
      weatherResults.map((w) => ({
        spotName: w.spotName,
        temperatureC: w.temperatureC,
        windSpeedMps: w.windSpeedMps,
        pressureHpa: w.pressureHpa,
        conditions: w.conditions,
      }));

    // 5. Ask Gemini to interpret the conditions (cache-aware)
    const userPrompt = buildFishingConditionsUserPrompt(weatherContexts);

    // Round coordinates to 2 decimal places (~1.1 km grid) for cache key.
    const latKey = body.userLat.toFixed(2);
    const lngKey = body.userLng.toFixed(2);
    const cacheKey = `${FISHING_CONDITIONS_CACHE_PREFIX}:${latKey}:${lngKey}`;

    type AiResult = { status: 'good' | 'okay' | 'poor'; description: string };

    const cached = await this.cacheManager.get<AiResult>(cacheKey);

    if (cached) {
      this.logger.log(`[fishing-conditions] Cache HIT  – key=${cacheKey}`);
      return { ai: { status: cached.status, description: cached.description } };
    }

    this.logger.log(
      `[fishing-conditions] Cache MISS – key=${cacheKey}, calling Gemini`,
    );

    const aiResult = await this.generateJsonResponse<AiResult>(
      FISHING_CONDITIONS_SYSTEM_PROMPT,
      userPrompt,
      fishingConditionsResponseSchema,
    );

    await this.cacheManager.set(cacheKey, aiResult);

    // 6. Return only the AI interpretation
    return {
      ai: {
        status: aiResult.status,
        description: aiResult.description,
      },
    };
  }

  private async generateJsonResponse<T>(
    systemPrompt: string,
    userPrompt: string,
    responseSchema: ResponseSchema,
  ): Promise<T> {
    if (!this.apiKey) {
      throw new BadGatewayException('AI servisi anahtari bulunamadi');
    }

    try {
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      const text = response.text;

      if (typeof text !== 'string' || text.length === 0) {
        this.logger.error('Gemini API empty or non-string response');
        throw new BadGatewayException('AI servisi gecersiz yanit dondu');
      }

      try {
        return JSON.parse(text) as T;
      } catch (error) {
        this.logger.error(
          `Gemini API JSON parse hatasi: ${(error as Error).message}`,
        );
        throw new BadGatewayException('AI servisi gecersiz JSON dondu');
      }
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      this.logger.error(`Gemini API hata: ${(error as Error).message}`);
      throw new BadGatewayException('AI servisi yanit veremedi');
    }
  }

  private async fetchFishingSpots(): Promise<PromptFishingSpot[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('fishing_spots')
      .select('*');

    if (error) {
      throw new InternalServerErrorException(
        `Meralar getirilirken hata oluştu: ${error.message}`,
      );
    }

    const rows = (data ?? []) as SupabaseFishingSpotRow[];

    return rows.map((spot) => this.mapFishingSpotRow(spot));
  }

  // fetchClosestSpots metodu FishingSpotsService'e taşındı.

  private async fetchGearStock(): Promise<PromptGearStock> {
    const [categoriesResult, productsResult] = await Promise.all([
      this.supabaseService
        .getClient()
        .from('categories')
        .select('id, name')
        .is('deleted_at', null),
      this.supabaseService
        .getClient()
        .from('products')
        .select('id, name, price, category_id')
        .is('deleted_at', null),
    ]);

    if (categoriesResult.error) {
      throw new InternalServerErrorException(
        `Kategoriler getirilirken hata oluştu: ${categoriesResult.error.message}`,
      );
    }

    if (productsResult.error) {
      throw new InternalServerErrorException(
        `Urunler getirilirken hata oluştu: ${productsResult.error.message}`,
      );
    }

    const categoryKeyById = new Map<string, keyof PromptGearStock>();

    for (const category of (categoriesResult.data ??
      []) as SupabaseCategoryRow[]) {
      const key = this.resolveGearCategoryKey(category.name);

      if (key) {
        categoryKeyById.set(category.id, key);
      }
    }

    const stock: PromptGearStock = {
      rods: [],
      reels: [],
      baits: [],
    };

    for (const product of (productsResult.data ?? []) as SupabaseProductRow[]) {
      if (!product.category_id) {
        continue;
      }

      const categoryKey = categoryKeyById.get(product.category_id);

      if (!categoryKey) {
        continue;
      }

      const price = Number(product.price);

      if (Number.isNaN(price) || !product.name) {
        continue;
      }

      stock[categoryKey].push({
        productId: product.id,
        urunAdi: product.name,
        fiyat: price,
      });
    }

    return stock;
  }

  private mapFishingSpotRow(row: SupabaseFishingSpotRow): PromptFishingSpot {
    const minDepth = this.formatDepthValue(row.min_depth);
    const maxDepth = this.formatDepthValue(row.max_depth);

    return {
      meraAdi: row.name,
      suTipi: row.water_type,
      derinlik: `${minDepth}-${maxDepth}`,
      koordinat: {
        lat: Number(row.center_lat),
        lng: Number(row.center_lng),
      },
    };
  }

  private formatDepthValue(value?: number | string | null): string {
    if (value === null || value === undefined || value === '') {
      return '?';
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return String(value);
    }

    return `${numericValue}m`;
  }

  private resolveGearCategoryKey(
    name?: string | null,
  ): keyof PromptGearStock | null {
    const normalized = `${name ?? ''}`.toLowerCase();

    if (
      normalized.includes('rod') ||
      normalized.includes('kamis') ||
      normalized.includes('olta')
    ) {
      return 'rods';
    }

    if (
      normalized.includes('reel') ||
      normalized.includes('makine') ||
      normalized.includes('misina')
    ) {
      return 'reels';
    }

    if (
      normalized.includes('bait') ||
      normalized.includes('yem') ||
      normalized.includes('sahte')
    ) {
      return 'baits';
    }

    return null;
  }
}
