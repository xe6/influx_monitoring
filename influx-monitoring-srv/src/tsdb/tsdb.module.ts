import { Module } from '@nestjs/common';
import { TsdbGateway } from './tsdb.gateway';
import { TsdbService } from './tsdb.service';

@Module({
  providers: [TsdbGateway, TsdbService],
  exports: [TsdbGateway, TsdbService],
})
export class TsdbModule {}
