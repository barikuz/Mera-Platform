/**
 * AiController - AI destekli balikcilik endpoint'leri
 *
 * Base URL: /ai
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { SpotRecommendationRequestDto } from './dto/spot-recommendation.dto';
import { GearRecommendationRequestDto } from './dto/gear-recommendation.dto';
import { TechnicalTipsRequestDto } from './dto/technical-tips.dto';
import {
  FishingConditionsRequestDto,
  FishingConditionsResponseDto,
} from './dto/fishing-conditions.dto';
import {
  GearRecommendationResponseDto,
  SpotRecommendationResponseDto,
  TechnicalTipsResponseDto,
} from './dto/ai-response.dto';

@ApiTags('Yapay Zeka (AI)')
@Controller()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('spot-recommendation')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Hedef balik icin mera onerisi getirir',
    description:
      'Hedef balik ve koordinatlara gore en uygun avlak noktalari icin AI destekli oneriler dondurur.',
  })
  @ApiResponse({
    status: 201,
    description: 'Mera onerileri basariyla getirildi.',
    type: SpotRecommendationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Gecersiz istek verisi.' })
  @ApiResponse({ status: 502, description: 'AI servisi kullanilamiyor.' })
  async getSpotRecommendation(
    @Body() body: SpotRecommendationRequestDto,
  ): Promise<SpotRecommendationResponseDto> {
    return this.aiService.getSpotRecommendation(body);
  }

  @Post('gear-recommendation')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Hedef balik icin ekipman seti onerir',
    description:
      'Hedef balik, koordinatlar ve avlanma stiline gore 3 parcalik ekipman seti onerir.',
  })
  @ApiResponse({
    status: 201,
    description: 'Ekipman seti basariyla getirildi.',
    type: GearRecommendationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Gecersiz istek verisi.' })
  @ApiResponse({ status: 502, description: 'AI servisi kullanilamiyor.' })
  async getGearRecommendation(
    @Body() body: GearRecommendationRequestDto,
  ): Promise<GearRecommendationResponseDto> {
    return this.aiService.getGearRecommendation(body);
  }

  @Post('technical-tips')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Hedef balik icin teknik ipuclari getirir',
    description:
      'Hedef balik ve koordinatlara gore 4 ana kategoride taktik oneri paketi dondurur.',
  })
  @ApiResponse({
    status: 201,
    description: 'Teknik ipuclari basariyla getirildi.',
    type: TechnicalTipsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Gecersiz istek verisi.' })
  @ApiResponse({ status: 502, description: 'AI servisi kullanilamiyor.' })
  async getTechnicalTips(
    @Body() body: TechnicalTipsRequestDto,
  ): Promise<TechnicalTipsResponseDto> {
    return this.aiService.getTechnicalTips(body);
  }

  @Get('fishing-conditions')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Konum bazli guncel av kosullarini getirir',
    description:
      'Kullanicinin konumuna en yakin 3 meranin hava durumu verisini cekar, Gemini ile yorumlar ve av kosulu ozeti dondurur.',
  })
  @ApiResponse({
    status: 200,
    description: 'Av kosullari basariyla getirildi.',
    type: FishingConditionsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Gecersiz koordinat verisi.' })
  @ApiResponse({
    status: 502,
    description: 'Hava durumu veya AI servisi kullanilamiyor.',
  })
  async getFishingConditions(
    @Query() query: FishingConditionsRequestDto,
  ): Promise<FishingConditionsResponseDto> {
    return this.aiService.getFishingConditions(query);
  }
}
