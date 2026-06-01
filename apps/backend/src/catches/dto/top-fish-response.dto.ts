import { ApiProperty } from '@nestjs/swagger';

export class TopFishResponseDto {
  @ApiProperty({
    description: 'Islem mesaji',
    example: 'En cok tutulan balik turleri getirildi',
  })
  message!: string;

  @ApiProperty({
    description: 'Av sayisina gore sirali balik turu adlari dizisi',
    example: ['Levrek', 'Palamut', 'Hamsi'],
    type: [String],
  })
  data!: string[];
}
