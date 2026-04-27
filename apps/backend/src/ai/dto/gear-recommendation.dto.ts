import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CoordinatesDto } from './coordinates.dto';

export class GearRecommendationRequestDto {
  @ApiProperty({
    description: 'Hedef balik turu',
    example: 'Levrek',
  })
  @IsString()
  @IsNotEmpty()
  targetFish!: string;

  @ApiProperty({
    description: 'Bolge koordinatlari',
    type: CoordinatesDto,
  })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates!: CoordinatesDto;

  @ApiProperty({
    description: 'Avlanma stili',
    example: 'Yemli',
  })
  @IsString()
  @IsNotEmpty()
  fishingStyle!: string;
}
