import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProfileDto {
    @ApiProperty({
        description: 'Platformda görünecek ad',
        example: 'Ahmet Balıkçı',
        maxLength: 150,
    })
    display_name: string;

    @ApiProperty({
        description: 'Kullanıcının e-postası (Benzersiz olmalıdır)',
        example: 'ahmet@mera.com',
        maxLength: 255,
    })
    email: string;

    @ApiPropertyOptional({
        description: 'Kullanıcının opsiyonel telefon numarası',
        example: '+905551234567',
        maxLength: 20,
    })
    phone_number?: string;

    @ApiPropertyOptional({
        description: 'Profil fotoğrafının tutulduğu URL adresi',
        example: 'https://mera.com/avatars/ahmet.jpg',
    })
    avatar_url?: string;
}