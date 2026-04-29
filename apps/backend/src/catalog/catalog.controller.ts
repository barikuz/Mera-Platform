/**
 * CatalogController - Katalog API Endpoint'leri
 *
 * Bu controller, balık türleri ve avlanma stilleri gibi referans verileri
 * almak için REST API endpoint'lerini tanımlar.
 *
 * Base URL: /catalog
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Katalog (Catalog)') // Swagger menüsünde görünecek başlık
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  /**
   * GET /catalog/fish-species
   * Tüm balık türlerini getirir.
   */
  @Get('fish-species')
  @ApiOperation({ summary: 'Tüm balık türlerini getirir' })
  @ApiResponse({
    status: 200,
    description: 'Balık türleri başarıyla alındı.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Veritabanı hatası.',
  })
  async getFishSpecies() {
    return this.catalogService.getFishSpecies();
  }

  /**
   * GET /catalog/fishing-styles
   * Tüm avlanma stillerini getirir.
   */
  @Get('fishing-styles')
  @ApiOperation({ summary: 'Tüm avlanma stillerini getirir' })
  @ApiResponse({
    status: 200,
    description: 'Avlanma stilleri başarıyla alındı.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Veritabanı hatası.',
  })
  async getFishingStyles() {
    return this.catalogService.getFishingStyles();
  }
}
