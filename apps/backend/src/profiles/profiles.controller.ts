import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Balıkçı Profilleri')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  @ApiOperation({ summary: 'Yeni profil oluşturur', description: 'Kullanıcı kayıt olduktan hemen sonra çalıştırılmalı ve temel profil bilgileri gönderilmelidir.' })
  @ApiResponse({ status: 201, description: 'Profil başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Eksik veya hatalı veri gönderildi.' })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm profilleri listeler', description: 'Sistemdeki tüm balıkçı profillerini getirir.' })
  @ApiResponse({ status: 200, description: 'Profiller başarıyla getirildi.' })
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tek bir profil getirir', description: 'ID numarasına göre spesifik bir balıkçının detaylarını getirir.' })
  @ApiParam({ name: 'id', description: 'Getirilecek profilin benzersiz ID numarası (UUID)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Profil bulundu.' })
  @ApiResponse({ status: 404, description: 'Profil bulunamadı.' })
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Profili günceller', description: 'Sadece değişen bilgileri göndererek profili günceller.' })
  @ApiParam({ name: 'id', description: 'Güncellenecek profilin ID numarası', type: 'string' })
  @ApiResponse({ status: 200, description: 'Profil başarıyla güncellendi.' })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Profili siler', description: 'Balıkçının profilini sistemden kaldırır (Soft delete uygulanacaktır).' })
  @ApiParam({ name: 'id', description: 'Silinecek profilin ID numarası', type: 'string' })
  @ApiResponse({ status: 200, description: 'Profil başarıyla silindi.' })
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
