import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

@Injectable()
export class ConfigService {
  constructor() {
    config();
  }

  public get<T>(key: string): T {
    if (process.env[key] === undefined) {
      throw new TypeError(`Enviroment ${key} not set!`);
    }
    try {
      return JSON.parse(String(process.env[key])) as T;
    } catch (err) {
      return (process.env[key] as unknown) as T;
    }
  }

  public set(key: string, value: any) {
    process.env[key] = value;
  }
}
