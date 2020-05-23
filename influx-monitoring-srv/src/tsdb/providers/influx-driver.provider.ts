import { Injectable } from '@nestjs/common';
import { InfluxDB } from '@influxdata/influxdb-client';
import { ConfigService, EnvConfig } from '../../config';

@Injectable()
export class InfluxDriver {
  constructor(private configService: ConfigService) {
    this.influxDB = new InfluxDB({
      url: this.configService.get<string>(EnvConfig.INFLUX_URL),
      token: this.configService.get<string>(EnvConfig.INFLUX_TOKEN),
    });

    this.bucket = this.configService.get<string>(EnvConfig.INFLUX_BUCKET);
    this.org = this.configService.get<string>(EnvConfig.INFLUX_ORG);
  }
  private influxDB: InfluxDB;

  private bucket = null;
  private org = null;

  public getWriteApi() {
    return this.influxDB.getWriteApi(this.org, this.bucket);
  }
}
