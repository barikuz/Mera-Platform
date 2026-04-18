import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Sistem Durumu')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API durumunu kontrol eder',
    description:
      'Sunucunun ayakta ve çalışır durumda olup olmadığını test etmek için kullanılan ana (root) uç noktasıdır.',
  })
  @ApiResponse({ status: 200, description: 'Sunucu sorunsuz çalışıyor.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
