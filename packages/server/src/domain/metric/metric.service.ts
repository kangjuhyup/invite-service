import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram, register } from 'prom-client';

@Injectable()
export class MetricService {
  private readonly httpRequestsCounter: Counter<string>;
  private readonly endpointRequestsCounter: Counter<string>;
  private readonly httpErrorsCounter: Counter<string>;
  private readonly memoryGauge: Gauge<string>;
  private readonly httpRequestHistogram: Histogram<string>;
  private readonly activeConnectionsGauge: Gauge<string>;

  constructor() {
    // HTTP 요청 총 수 메트릭
    this.httpRequestsCounter = new Counter({
      name: 'http_requests_total',
      help: '전체 HTTP 요청 수',
      labelNames: ['method', 'path', 'status'],
    });

    // 엔드포인트별 요청 수 메트릭
    this.endpointRequestsCounter = new Counter({
      name: 'endpoint_requests_total',
      help: '엔드포인트별 요청 수',
      labelNames: ['endpoint', 'method', 'status'],
    });

    // HTTP 에러 수 메트릭
    this.httpErrorsCounter = new Counter({
      name: 'http_errors_total',
      help: 'HTTP 에러 발생 수',
      labelNames: ['method', 'path', 'status', 'error_type'],
    });

    // 메모리 사용량 메트릭
    this.memoryGauge = new Gauge({
      name: 'memory_usage_bytes',
      help: '현재 메모리 사용량 (bytes)',
      labelNames: ['type'],
    });

    // HTTP 요청 지연시간 메트릭
    this.httpRequestHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: '요청 지연시간 (초)',
      labelNames: ['path', 'method', 'status'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 2.5, 5, 10],
    });

    // 활성 연결 수 메트릭
    this.activeConnectionsGauge = new Gauge({
      name: 'active_connections',
      help: '현재 활성 연결 수',
    });

    // 메트릭을 Prometheus에 등록
    register.registerMetric(this.httpRequestsCounter);
    register.registerMetric(this.endpointRequestsCounter);
    register.registerMetric(this.httpErrorsCounter);
    register.registerMetric(this.memoryGauge);
    register.registerMetric(this.httpRequestHistogram);
    register.registerMetric(this.activeConnectionsGauge);
  }

  incrementHttpRequest(method: string, path: string, status: number) {
    this.httpRequestsCounter.inc({ method, path, status });
  }

  incrementEndpointRequest(endpoint: string, method: string, status: number) {
    this.endpointRequestsCounter.inc({ endpoint, method, status });
  }

  incrementHttpError(method: string, path: string, status: number, errorType: string) {
    this.httpErrorsCounter.inc({ method, path, status, error_type: errorType });
  }

  updateMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    this.memoryGauge.set({ type: 'heapUsed' }, memoryUsage.heapUsed);
    this.memoryGauge.set({ type: 'heapTotal' }, memoryUsage.heapTotal);
    this.memoryGauge.set({ type: 'rss' }, memoryUsage.rss);
    this.memoryGauge.set({ type: 'external' }, memoryUsage.external);
  }

  recordHttpRequestDuration(path: string, method: string, status: number, duration: number) {
    this.httpRequestHistogram.observe({ path, method, status }, duration);
  }

  updateActiveConnections(count: number) {
    this.activeConnectionsGauge.set(count);
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
