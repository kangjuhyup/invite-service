import { OnModuleInit } from '@nestjs/common';
export declare class AppService implements OnModuleInit {
    private config;
    onModuleInit(): Promise<void>;
    getHello(): string;
    removeBackground(file: Express.Multer.File): Promise<Buffer>;
}
