/**
 * FishingSpotsController - Mera API Endpoint'leri
 *
 * Bu controller, balık avlama noktaları (meralar) için REST API endpoint'lerini tanımlar.
 * Swagger/OpenAPI dokümantasyonu ile entegre çalışır.
 *
 * Base URL: /fishing-spots
 */
import { Controller, Get, Post, Body } from '@nestjs/common';
import { FishingSpotsService } from './fishing-spots.service';
import { CreateFishingSpotDto } from './dto/create-fishing-spot.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Meralar (Fishing Spots)') // Swagger menüsünde görünecek başlık
@Controller('fishing-spots')
export class FishingSpotsController {
  // FishingSpotsService dependency injection ile enjekte edilir
  constructor(private readonly fishingSpotsService: FishingSpotsService) {}

  /**
   * POST /fishing-spots
   * Yeni bir mera oluşturur ve veritabanına kaydeder.
   */
  @Post()
  @ApiOperation({ summary: 'Yeni bir mera (fishing spot) ekler' })
  @ApiResponse({ status: 201, description: 'Mera başarıyla oluşturuldu.' })
  @ApiResponse({
    status: 400,
    description: 'Hatalı veri girişi (Validation Error).',
  })
  create(@Body() createFishingSpotDto: CreateFishingSpotDto) {
    return this.fishingSpotsService.create(createFishingSpotDto);
  }

  /**
   * GET /fishing-spots
   * Tüm meraları listeler (harita üzerinde göstermek için).
   */
  @Get()
  @ApiOperation({ summary: 'Haritada göstermek için tüm meraları getirir' })
  @ApiResponse({
    status: 200,
    description: 'Meralar listesi başarıyla getirildi.',
  })
  findAll() {
    return this.fishingSpotsService.findAll();
  }
}
