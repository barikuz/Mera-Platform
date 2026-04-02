import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShopService } from './shop.service';

@ApiTags('Mağaza (Shop)')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Aktif kategorileri getirir' })
  @ApiResponse({ status: 200, description: 'Kategoriler başarıyla getirildi.' })
  findCategories() {
    return this.shopService.findActiveCategories();
  }

  @Get('products')
  @ApiOperation({ summary: 'Aktif ürünleri getirir' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Kategoriye göre filtreleme yapmak için kategori kimliği',
  })
  @ApiResponse({ status: 200, description: 'Ürünler başarıyla getirildi.' })
  findProducts(@Query('categoryId') categoryId?: string) {
    return this.shopService.findActiveProducts(categoryId);
  }
}
