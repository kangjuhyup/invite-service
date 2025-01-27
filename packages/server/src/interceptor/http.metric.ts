import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricService } from '@app/domain/metric/metric.service';

@Injectable()
export class MetricInterceptor implements NestInterceptor {
  constructor(private readonly metricService: MetricService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const path = request.route?.path || 'unknown';
    const method = request.method;

    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - now) / 1000; // 초 단위
        const statusCode = response.statusCode;
        
        // HTTP 요청 카운트 증가
        this.metricService.incrementHttpRequest(method, path, statusCode);
        
        // 요청 처리 시간 기록
        this.metricService.recordHttpRequestDuration(path, method,statusCode ,duration);
        
        // 성공한 요청 카운트 증가 (2xx, 3xx)
        if (statusCode < 400) {
          // this.metricService.incrementSuccessfulRequest(method, path);
        }
      }),
      catchError((error) => {
        const duration = (Date.now() - now) / 1000;
        const statusCode = error.status || 500;
        
        // 에러 요청 카운트 증가
        this.metricService.incrementHttpRequest(method, path, statusCode);
        // this.metricService.incrementFailedRequest(method, path, statusCode);
        
        // 에러 처리 시간 기록
        this.metricService.recordHttpRequestDuration(path, method,statusCode ,duration);
        
        throw error;
      }),
    );
  }
}
