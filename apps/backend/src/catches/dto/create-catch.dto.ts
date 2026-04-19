import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'catchLocationPair', async: false })
class CatchLocationPairConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const object = args.object as CreateCatchDto;
    const otherProperty = args.constraints[0] as
      | 'location_lat'
      | 'location_lng';
    const hasCurrent = value !== undefined && value !== null;
    const otherValue = object[otherProperty];
    const hasOther = otherValue !== undefined && otherValue !== null;

    return (hasCurrent && hasOther) || (!hasCurrent && !hasOther);
  }

  defaultMessage(): string {
    return 'location_lat ve location_lng birlikte gönderilmelidir';
  }
}

export class CreateCatchDto {
  @ApiProperty({
    description: 'Yakaladiginiz baligin turu',
    example: 'Sazan',
  })
  @IsString()
  @IsNotEmpty()
  species!: string;

  @ApiPropertyOptional({
    description: 'Baligin kilogram cinsinden agirligi',
    example: 2.75,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  weight_kg?: number;

  @ApiPropertyOptional({
    description: 'Baligin santimetre cinsinden boyu',
    example: 48.2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  length_cm?: number;

  @ApiPropertyOptional({
    description: 'Av noktasinin enlem degeri',
    example: 38.4237,
  })
  @IsOptional()
  @Type(() => Number)
  @Validate(CatchLocationPairConstraint, ['location_lng'])
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-90)
  @Max(90)
  location_lat?: number;

  @ApiPropertyOptional({
    description: 'Av noktasinin boylam degeri',
    example: 38.1234,
  })
  @IsOptional()
  @Type(() => Number)
  @Validate(CatchLocationPairConstraint, ['location_lat'])
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  location_lng?: number;
}
