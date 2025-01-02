import { Global, Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricService } from './metric.service';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true, // 기본 메트릭 활성화
      },
    })
  ],
  providers: [MetricService],
  exports: [MetricService],
})
export class MetricModule {}
