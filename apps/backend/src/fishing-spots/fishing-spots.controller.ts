/**
 * FishingSpotsController - Mera API Endpoint'leri
 *
 * Bu controller, balık avlama noktaları (meralar) için REST API endpoint'lerini tanımlar.
 * Swagger/OpenAPI dokümantasyonu ile entegre çalışır.
 *
 * Base URL: /fishing-spots
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseFloatPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FishingSpotsService } from './fishing-spots.service';
import { CreateFishingSpotDto } from './dto/create-fishing-spot.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiProperty,
} from '@nestjs/swagger';

class NearestSpotsResponseDto {
  @ApiProperty({ example: 'En yakın meralar getirildi' })
  message: string;

  @ApiProperty({
    description: 'En yakın avlak noktaları listesi',
    example: [
      {
        name: 'Kilyos Koyu',
        water_type: 'Tuzlu Su',
        center_lat: 41.2457,
        center_lng: 29.0221,
        min_depth: 5,
        max_depth: 30,
      },
    ],
  })
  data: unknown[];
}

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

  /**
   * GET /fishing-spots/nearest?lat=&lng=&limit=
   * Kullanıcı koordinatlarına en yakın meraları döndürür.
   * Mesafe hesabı PostgreSQL tarafında Haversine formülüyle yapılır.
   */
  @Get('nearest')
  @ApiOperation({
    summary: 'Kullanıcıya en yakın meraları getirir',
    description:
      'Verilen koordinatlara göre Haversine mesafesi hesaplayarak en yakın avlak noktalarını sıralar ve döndürür. "En Yakın Meralar" ekran bölümü için kullanılır.',
  })
  @ApiQuery({
    name: 'lat',
    required: true,
    type: Number,
    description: 'Kullanıcının enlem değeri (latitude)',
    example: 41.0082,
  })
  @ApiQuery({
    name: 'lng',
    required: true,
    type: Number,
    description: 'Kullanıcının boylam değeri (longitude)',
    example: 28.9784,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Döndürülecek maksimum mera sayısı (varsayılan: 3)',
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'En yakın meralar başarıyla getirildi.',
    type: NearestSpotsResponseDto,
  })
  async findNearest(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
  ) {
    const data = await this.fishingSpotsService.fetchClosestSpots(
      lat,
      lng,
      limit,
    );
    return { message: 'En yakın meralar getirildi', data };
  }
}
