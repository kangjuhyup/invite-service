import { PipeTransform } from '@nestjs/common';
export declare class ParseJsonPipe implements PipeTransform<string, any> {
    transform(value: string): any;
}
