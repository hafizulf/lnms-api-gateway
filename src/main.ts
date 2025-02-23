import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './modules/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('APP_PORT') || 8000;

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Start listening
  await app.listen(appPort);
  console.log(`API Gateway is running on http://localhost:${appPort}`);
}
bootstrap();
