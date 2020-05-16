import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class TsdbService {
  constructor(private readonly redisService: RedisService) {
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
}
