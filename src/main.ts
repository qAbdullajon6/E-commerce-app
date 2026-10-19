import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { dirname, join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { fileURLToPath } from 'url';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  const config = new DocumentBuilder()
    .setTitle('My E-commerce')
    .setDescription('E-commerce API documentation')
    .setVersion('1.0')
    .addBearerAuth() 
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
