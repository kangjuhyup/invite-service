import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram, register } from 'prom-client';

@Injectable()
export class MetricService {
  private readonly httpRequestsCounter: Counter<string>;
  private readonly memoryGauge: Gauge<string>;
  private readonly httpRequestHistogram: Histogram<string>;

  constructor() {
    this.httpRequestsCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path'],
    });

    this.memoryGauge = new Gauge({
      name: 'memory_usage_bytes',
      help: 'Current memory usage in bytes',
    });

    this.httpRequestHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Request latency in seconds',
      labelNames: ['path', 'method'],
      buckets: [0.1, 0.5, 1, 2.5, 5, 10],
    });

    // 메트릭을 Prometheus에 등록
    register.registerMetric(this.httpRequestsCounter);
    register.registerMetric(this.memoryGauge);
    register.registerMetric(this.httpRequestHistogram);
  }

  incrementHttpRequest(method: string, path: string) {
    this.httpRequestsCounter.inc({ method, path });
  }

  updateMemoryUsage() {
    const usedMemory = process.memoryUsage().heapUsed;
    this.memoryGauge.set(usedMemory);
  }

  recordHttpRequestDuration(path: string, method: string, duration: number) {
    this.httpRequestHistogram.observe({ path, method }, duration);
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
