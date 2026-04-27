import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CoordinatesDto } from './coordinates.dto';

export class TechnicalTipsRequestDto {
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
}
