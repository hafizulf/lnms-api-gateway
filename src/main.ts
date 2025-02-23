import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Set global prefix
  app.setGlobalPrefix('api');

  // Start listening
  const PORT = process.env.PORT || 8000;
  await app.listen(PORT);
  console.log(`API Gateway is running on http://localhost:${PORT}`);
}
bootstrap();
