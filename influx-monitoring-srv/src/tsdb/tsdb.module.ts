import { Module } from '@nestjs/common';
import { TsdbGateway } from './tsdb.gateway';
import { TsdbService } from './tsdb.service';
import { TsdbController } from './tsdb.controller';
import { InfluxDriver } from './providers/influx-driver.provider';

@Module({
  controllers: [TsdbController],
  providers: [TsdbGateway, TsdbService, InfluxDriver],
  exports: [TsdbGateway, TsdbService, InfluxDriver],
})
export class TsdbModule {}
