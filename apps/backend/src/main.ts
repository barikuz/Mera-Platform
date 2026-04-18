import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== 'production') {
    // Swagger Yapılandırması (Menü Tasarımı)
    const config = new DocumentBuilder()
      .setTitle('Mera Platform API')
      .setDescription(
        'Mera uygulamasının Web ve Mobil istemcileri için API dokümantasyonu.',
      )
      .setVersion('1.0')
      .addBearerAuth() // İleride kullanıcı giriş yapınca Token göndermek için lazım olacak
      .build();

    // Dokümanı oluştur ve /api/docs adresine bağla
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3001);
  console.log('Uygulama çalışıyor: http://localhost:3001');
}
bootstrap();
