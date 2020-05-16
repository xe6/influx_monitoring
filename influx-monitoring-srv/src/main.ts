import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  await app.listen(process.env.APP_PORT);
  Logger.log(`Server is running on port ${process.env.APP_PORT}`, 'SUCCESS!');
}
bootstrap();
