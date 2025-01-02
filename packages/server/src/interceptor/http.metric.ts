import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
 import { MetricService } from '@app/domain/metric/metric.service';
  
  @Injectable()
  export class MetricInterceptor implements NestInterceptor {
    constructor(
        private readonly metricService: MetricService
    ) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const now = Date.now();
      const request = context.switchToHttp().getRequest();
      const path = request.route?.path || 'unknown';
      const method = request.method;
  
      return next.handle().pipe(
        tap(() => {
          const duration = (Date.now() - now) / 1000; // 초 단위
          this.metricService.incrementHttpRequest(method, path);
          this.metricService.recordHttpRequestDuration(path, method, duration);
        }),
      );
    }
  }
  