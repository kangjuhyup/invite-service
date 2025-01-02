import { Controller, Get, Header } from '@nestjs/common';
import { MetricService } from './metric.service';

@Controller('metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}
  
  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    return await this.metricService.getMetrics();
  }
}