import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './exception-filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Product Chatbot API')
    .setDescription(
      'This API exposes a single endpoint that allows interaction with an AI-powered chatbot. It receives user messages, processes the input, and responds with intelligent product suggestions or related information. Ideal for assisting users in finding products based on natural language queries.'
    )
    .setVersion('1.0')
    .addTag('chat', 'AI chatbot interaction')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new CustomExceptionFilter());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(3000);
}

bootstrap();
