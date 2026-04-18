import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { PaymentCardDto } from './payment-card.dto';

// Bu DTO, siparis olusturma isteginde beklenen tum alanlari dogrulamak icin kullanilir.
export class CreateOrderDto {
  @ApiProperty({
    description: 'Teslimat alici adi soyadi',
    example: 'Ahmet Balikci',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  shippingName!: string;

  @ApiProperty({
    description: 'Teslimat icin telefon numarasi',
    example: '+905551234567',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  shippingPhone!: string;

  @ApiProperty({
    description: 'Teslimat adresi',
    example: 'Keban Mah. Sahil Yolu No:12, Elazig',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress!: string;

  @ApiProperty({
    description: 'Siparisteki urunler ve adetleri',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiProperty({
    description:
      'Odeme karti bilgileri (yalnizca iyzico odeme istegine aktarilir ve kaydedilmez)',
    type: PaymentCardDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentCardDto)
  paymentCard!: PaymentCardDto;
}
