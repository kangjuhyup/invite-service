import { LetterModule } from './domain/letter/letter.module';
import { StorageModule } from 'packages/server/src/storage/storage.module';
export declare const routers: (typeof LetterModule | import("@nestjs/common").DynamicModule)[];
export declare const modules: (typeof StorageModule | import("@nestjs/common").DynamicModule | Promise<import("@nestjs/common").DynamicModule>)[];
export declare class AppModule {
}
