import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { InfluxDriver } from './providers/influx-driver.provider';
import { Point } from '@influxdata/influxdb-client';

@Injectable()
export class TsdbService {
  constructor(
    private readonly redisService: RedisService,
    private readonly influxDriver: InfluxDriver,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  private redisClient: Redis;

  public async putVisitorIpInKV(visitorIp: string, wsid: string) {
    return this.redisClient.set(visitorIp, wsid);
  }

  public async getVisitorIpInKV(visitorIp: string) {
    return this.redisClient.get(visitorIp);
  }

  public async removeVisitorIpInKV(visitorIp: string) {
    return this.redisClient.del(visitorIp);
  }

  public async writeTestData() {
    const point = new Point('visitors')
      .tag('website', 'ezic.io')
      .intField('amount', 50);

    const writeApi = this.influxDriver.getWriteApi();
    writeApi.writePoint(point);
    await writeApi.close();
  }
}
