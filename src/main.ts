// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('Social OAuth & Posts API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'Authorization')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  app.enableCors({
    origin: 'http://localhost:4200',  // allow Angular dev server
    credentials: true,                // allow cookies (if using)
  });
  await app.listen(3000);
}
bootstrap();
