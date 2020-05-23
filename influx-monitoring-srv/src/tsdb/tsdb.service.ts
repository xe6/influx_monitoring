import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { InfluxDriver } from './providers/influx-driver.provider';
import { Point } from '@influxdata/influxdb-client';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TsdbService {
  constructor(
    private readonly redisService: RedisService,
    private readonly influxDriver: InfluxDriver,
    @InjectQueue('analytics')
    private analyticsQueue: Queue,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  private redisClient: Redis;

  public async startAnalytics(website: string) {
    return this.analyticsQueue.add(
      'analytics',
      { website },
      { repeat: { every: 10000 } },
    );
  }

  public async putVisitorIpInKV(visitorIp: string, wsid: string) {
    return this.redisClient.set(visitorIp, wsid);
  }

  public async getVisitorIpInKV(visitorIp: string) {
    return this.redisClient.get(visitorIp);
  }

  public async removeVisitorIpInKV(visitorIp: string) {
    return this.redisClient.del(visitorIp);
  }

  public async refreshActiveUsers(website: string, amount: number) {
    return this.redisClient.set(`VISITORS_AMOUNT_${website}`, amount);
  }

  public async writeCurrentActiveUsers(website: string) {
    const amount = await this.redisClient.get(`VISITORS_AMOUNT_${website}`)
    const point = new Point('visitors')
    .tag('website', website)
    .intField('amount', amount);

    const writeApi = this.influxDriver.getWriteApi();
    writeApi.writePoint(point);
    Logger.debug('Successfully saved new point:');
    Logger.debug(point);
    await writeApi.close();
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
