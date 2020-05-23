import { Controller, Get } from '@nestjs/common';
import { TsdbService } from './tsdb.service';

@Controller()
export class TsdbController {
  constructor(private readonly tsdbService: TsdbService) {}

  @Get()
  public async index() {
    await this.tsdbService.writeTestData();
    return true;
  }
}
