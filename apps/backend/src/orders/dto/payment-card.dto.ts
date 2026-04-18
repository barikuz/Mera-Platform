import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

// Bu DTO, iyzico odeme istegine aktarilacak kart alanlarini dogrulamak icin kullanilir.
export class PaymentCardDto {
  @ApiProperty({
    description: 'Kart uzerindeki ad soyad',
    example: 'Ahmet Balikci',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  cardHolderName!: string;

  @ApiProperty({
    description: 'Banka kart numarasi (yalnizca iyzico isteginde kullanilir)',
    example: '5528790000000008',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{12,19}$/)
  cardNumber!: string;

  @ApiProperty({
    description: 'Kart son kullanma ayi (MM)',
    example: '12',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])$/)
  expireMonth!: string;

  @ApiProperty({
    description: 'Kart son kullanma yili (YY veya YYYY)',
    example: '2030',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}(\d{2})?$/)
  expireYear!: string;

  @ApiProperty({
    description: 'Kart guvenlik kodu',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3,4}$/)
  cvc!: string;
}
