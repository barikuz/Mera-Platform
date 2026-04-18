import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Sepete eklenen ürünün benzersiz kimliği',
    example: '7b8d8f54-6d8e-4ab6-a1d8-7f5a2eae2c11',
  })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({
    description: 'Sipariş edilen ürün adedi',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
