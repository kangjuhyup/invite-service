import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

interface HttpResponse<T> {
  result: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

@Injectable()
export class ResponseValidationInterceptor<T extends object>
  implements NestInterceptor
{
  constructor(private readonly dto: new () => T) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (response: HttpResponse<T>) => {
        if (response.data) {
          const object = plainToInstance(this.dto, response.data);
          const errors = await validate(object);
          if (errors.length > 0) {
            throw new InternalServerErrorException(
              'Invalid response data',
              this.formatErrors(errors),
            );
          }
        }

        return response;
      }),
    );
  }

  private formatErrors(errors: ValidationError[]): string {
    console.error(JSON.stringify(errors));
    return JSON.stringify(
      errors.map((err) => Object.values(err.constraints || '').join(', ')),
    );
  }
}
