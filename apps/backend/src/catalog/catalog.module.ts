/**
 * CatalogModule - Katalog Modülü
 *
 * Bu modül, balık türleri ve avlanma stilleri gibi referans verilerini
 * sağlamak için gerekli controller ve service bileşenlerini bir araya getirir.
 *
 * SupabaseService, @Global() dekoratörü sayesinde otomatik olarak
 * bu modülde kullanılabilir durumda olduğundan ayrıca import edilmesine gerek yoktur.
 */
import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
