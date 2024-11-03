import { DynamicModule } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
interface RedisModuleAsyncOptions {
    project: string;
    imports?: any[];
    inject?: any[];
    useFactory: (...args: any[]) => RedisOptions | Promise<RedisOptions>;
    isGlobal?: boolean;
}
export declare class RedisClientModule {
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule;
}
export {};
