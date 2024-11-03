import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class ResponseValidationInterceptor<T extends object> implements NestInterceptor {
    private readonly dto;
    constructor(dto: new () => T);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private formatErrors;
}
