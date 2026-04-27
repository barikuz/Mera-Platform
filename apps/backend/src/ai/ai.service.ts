/**
 * AiService - Gemini AI entegrasyonu
 *
 * Uc AI modulunu Gemini API ile cagirir ve JSON yanitlarini dogrular.
 */
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import {
  GEAR_RECOMMENDATION_SYSTEM_PROMPT,
  SPOT_RECOMMENDATION_SYSTEM_PROMPT,
  TECHNICAL_TIPS_SYSTEM_PROMPT,
  buildGearRecommendationUserPrompt,
  buildSpotRecommendationUserPrompt,
  buildTechnicalTipsUserPrompt,
} from './ai.prompts';
import {
  gearRecommendationResponseSchema,
  spotRecommendationResponseSchema,
  technicalTipsResponseSchema,
} from './ai.schemas';
import {
  GearRecommendationResponseDto,
  SpotRecommendationResponseDto,
  TechnicalTipsResponseDto,
} from './dto/ai-response.dto';
import { GearRecommendationRequestDto } from './dto/gear-recommendation.dto';
import { SpotRecommendationRequestDto } from './dto/spot-recommendation.dto';
import { TechnicalTipsRequestDto } from './dto/technical-tips.dto';

type ResponseSchema = Record<string, unknown>;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly genAI: GoogleGenAI;
  private readonly modelName = 'gemini-3-flash-preview';

  constructor(private readonly configService: ConfigService) {
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
    const userPrompt = buildSpotRecommendationUserPrompt(body);
    return this.generateJsonResponse<SpotRecommendationResponseDto>(
      SPOT_RECOMMENDATION_SYSTEM_PROMPT,
      userPrompt,
      spotRecommendationResponseSchema,
    );
  }

  async getGearRecommendation(
    body: GearRecommendationRequestDto,
  ): Promise<GearRecommendationResponseDto> {
    const userPrompt = buildGearRecommendationUserPrompt(body);
    return this.generateJsonResponse<GearRecommendationResponseDto>(
      GEAR_RECOMMENDATION_SYSTEM_PROMPT,
      userPrompt,
      gearRecommendationResponseSchema,
    );
  }

  async getTechnicalTips(
    body: TechnicalTipsRequestDto,
  ): Promise<TechnicalTipsResponseDto> {
    const userPrompt = buildTechnicalTipsUserPrompt(body);
    return this.generateJsonResponse<TechnicalTipsResponseDto>(
      TECHNICAL_TIPS_SYSTEM_PROMPT,
      userPrompt,
      technicalTipsResponseSchema,
    );
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
}
