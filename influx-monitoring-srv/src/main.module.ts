import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TsdbModule } from './tsdb/tsdb.module';

@Module({
  imports: [ConfigModule.forRoot(), TsdbModule],
})
export class MainModule {}
