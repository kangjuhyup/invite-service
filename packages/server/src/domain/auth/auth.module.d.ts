import { DynamicModule } from '@nestjs/common';
interface AuthModuleAsyncOptions {
    imports?: any[];
    inject?: any[];
    useFactory: (...args: any[]) => {
        secret: string;
        expiresIn: string;
    };
    isGlobal?: boolean;
}
export declare class AuthModule {
    static forRootAsync(options: AuthModuleAsyncOptions): DynamicModule;
}
export {};
