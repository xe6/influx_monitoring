import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { Logger } from '@nestjs/common';
import { ConfigService, EnvConfig } from './config';

async function bootstrap() {
  const srv = await NestFactory.create(MainModule);
  const configService = srv.get<ConfigService>(ConfigService);
  await srv.listen(configService.get<number>(EnvConfig.APP_PORT));
  Logger.log(`Server is running on port ${process.env.APP_PORT}`, 'SUCCESS!');
}
bootstrap();
