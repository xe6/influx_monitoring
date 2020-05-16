import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { TsdbModule } from './tsdb/tsdb.module';
import { ConfigModule, ConfigService, EnvConfig } from './config';

@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>(EnvConfig.REDIS_URL),
      }),
      inject: [ConfigService],
    }),
    TsdbModule,
  ],
  exports: [ConfigModule, TsdbModule],
})
export class MainModule {}
