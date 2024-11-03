import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private readonly configService;
    private s3Client;
    constructor(configService: ConfigService);
    generateUploadPresignedUrl(param: {
        bucket: string;
        key: string;
        expires: number;
        meta?: any;
    }): Promise<string>;
    generateDownloadPresignedUrl(param: {
        bucket: string;
        key: string;
        expires: number;
    }): Promise<string>;
    getObjectMetadata(param: {
        bucket: string;
        key: string;
    }): Promise<any>;
    deleteObject(param: {
        bucket: string;
        key: string;
    }): Promise<void>;
}
