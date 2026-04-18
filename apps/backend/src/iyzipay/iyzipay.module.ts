import { Module } from '@nestjs/common';
import { IyzipayService } from './iyzipay.service';

// Bu modul, iyzico odeme islemlerini tek noktadan yonetmek icin IyzipayService'i disa acar.
@Module({
  providers: [IyzipayService],
  exports: [IyzipayService],
})
export class IyzipayModule {}
