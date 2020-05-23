import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TsdbGateway } from './tsdb.gateway';
import { TsdbService } from './tsdb.service';
import { TsdbController } from './tsdb.controller';
import { InfluxDriver } from './providers/influx-driver.provider';
import { ConfigService, EnvConfig } from '../config';
import { AnalyticsConsumer } from './analytics.processor';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'analytics',
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>(EnvConfig.REDIS_HOST),
          port: configService.get<number>(EnvConfig.REDIS_PORT),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TsdbController],
  providers: [TsdbGateway, TsdbService, InfluxDriver, AnalyticsConsumer],
  exports: [TsdbGateway, TsdbService, InfluxDriver, AnalyticsConsumer],
})
export class TsdbModule {}
