/**
 * UpdateFishingSpotDto - Mera Güncelleme Veri Transfer Nesnesi
 *
 * Bu DTO, mevcut bir merayı güncellerken kullanılır.
 * PartialType sayesinde CreateFishingSpotDto'daki tüm alanlar opsiyonel hale gelir.
 * Bu, kısmi güncelleme (PATCH) işlemlerini kolaylaştırır.
 */
import { PartialType } from '@nestjs/swagger';
import { CreateFishingSpotDto } from './create-fishing-spot.dto';

// PartialType: Tüm alanları opsiyonel yapar, Swagger dokümantasyonunu da günceller
export class UpdateFishingSpotDto extends PartialType(CreateFishingSpotDto) {}
