import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { TsdbService } from './tsdb.service';

@Processor('analytics')
export class AnalyticsConsumer {
  constructor(private tsdbService: TsdbService) {}
  @Process('analytics')
  async analytics(job: Job<{ website: string }>) {
    await this.tsdbService.writeCurrentActiveUsers(job.data.website);
  }
}
