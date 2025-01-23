import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers, query } = request;

    return next.handle().pipe(
      catchError((error) => {
        // 에러 정보 구성
        const errorLog = {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            status: error instanceof HttpException ? error.getStatus() : 500,
          },
          request: {
            timestamp: new Date().toISOString(),
            path: url,
            method,
            body,
            query,
            headers: {
              ...headers,
              authorization: headers.authorization ? '[REDACTED]' : undefined,
            },
          },
        };

        // HttpException이 아닌 경우 InternalServerErrorException으로 변환
        if (!(error instanceof HttpException)) {
          this.logger.error({
            msg: '시스템 에러가 발생했습니다.',
            ...errorLog,
          });
          return throwError(
            () => new InternalServerErrorException('서버 에러가 발생했습니다.'),
          );
        }

        // HttpException인 경우 로그 레벨 구분
        const status = error.getStatus();
        if (status >= 500) {
          this.logger.error({
            msg: '서버 에러가 발생했습니다.',
            ...errorLog,
          });
        } else if (status >= 400) {
          this.logger.warn({
            msg: '클라이언트 에러가 발생했습니다.',
            ...errorLog,
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
