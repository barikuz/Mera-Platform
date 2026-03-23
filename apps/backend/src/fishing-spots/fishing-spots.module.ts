/**
 * FishingSpotsModule - Mera (Balık Avlama Noktası) Modülü
 *
 * Bu modül, balık avlama noktalarının (meraların) yönetimi için gerekli
 * controller ve service bileşenlerini bir araya getirir.
 *
 * SupabaseService, @Global() dekoratörü sayesinde otomatik olarak
 * bu modülde kullanılabilir durumda olduğundan ayrıca import edilmesine gerek yoktur.
 */
import { Module } from '@nestjs/common';
import { FishingSpotsService } from './fishing-spots.service';
import { FishingSpotsController } from './fishing-spots.controller';

@Module({
  // HTTP isteklerini karşılayan controller
  controllers: [FishingSpotsController],
  // İş mantığını içeren servis
  providers: [FishingSpotsService],
})
export class FishingSpotsModule {}
