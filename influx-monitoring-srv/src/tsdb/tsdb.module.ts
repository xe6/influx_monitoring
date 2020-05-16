import { Module } from '@nestjs/common';
import { TsdbGateway } from './tsdb.gateway';

@Module({
  providers: [TsdbGateway]
})
export class TsdbModule {}
