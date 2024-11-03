"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const storage_service_1 = require("../storage.service");
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn(),
}));
describe('StorageService', () => {
    let service;
    let configService;
    let s3Client;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                storage_service_1.StorageService,
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn((key) => {
                            switch (key) {
                                case 'WASABI_ACCESS_KEY':
                                    return 'test-access-key';
                                case 'WASABI_SECRET_KEY':
                                    return 'test-secret-key';
                                case 'WASABI_REGION':
                                    return 'us-east-1';
                                case 'WASABI_ENDPOINT':
                                    return 'https://s3.wasabisys.com';
                                default:
                                    return null;
                            }
                        }),
                    },
                },
            ],
        }).compile();
        service = module.get(storage_service_1.StorageService);
        configService = module.get(config_1.ConfigService);
        s3Client = service['s3Client'];
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('presignedUrl 생성', () => {
        it('다운로드 Url 생성', async () => {
            s3_request_presigner_1.getSignedUrl.mockResolvedValue('https://presigned-download-url');
            const url = await service.generateDownloadPresignedUrl({
                bucket: 'test-bucket',
                key: 'test-key',
                expires: 3600,
            });
            expect(s3_request_presigner_1.getSignedUrl).toHaveBeenCalledWith(s3Client, expect.any(client_s3_1.GetObjectCommand), { expiresIn: 3600 });
            expect(url).toBe('https://presigned-download-url');
        });
        it('업로드 Url 생성', async () => {
            s3_request_presigner_1.getSignedUrl.mockResolvedValue('https://presigned-upload-url');
            const url = await service.generateUploadPresignedUrl({
                bucket: 'test-bucket',
                key: 'test-key',
                expires: 3600,
            });
            expect(s3_request_presigner_1.getSignedUrl).toHaveBeenCalledWith(s3Client, expect.any(client_s3_1.PutObjectCommand), { expiresIn: 3600 });
            expect(url).toBe('https://presigned-upload-url');
        });
    });
    describe('메타데이터 조회', () => {
        it('파일이 있을 경우', async () => {
            const mockMetadata = { ContentLength: 12345 };
            s3Client.send.mockResolvedValue(mockMetadata);
            const metadata = await service.getObjectMetadata({
                bucket: 'test-bucket',
                key: 'test-key',
            });
            expect(s3Client.send).toHaveBeenCalledWith(expect.any(client_s3_1.HeadObjectCommand));
            expect(metadata).toEqual(mockMetadata);
        });
        it('파일이 없을 경우', async () => {
            s3Client.send.mockRejectedValue({ name: 'NotFound' });
            const metadata = await service.getObjectMetadata({
                bucket: 'test-bucket',
                key: 'test-key',
            });
            expect(metadata).toBeUndefined();
        });
    });
    describe('파일 삭제', () => {
        it('파일이 있을 경우', async () => {
            s3Client.send.mockResolvedValue({});
            await expect(service.deleteObject({ bucket: 'test-bucket', key: 'test-key' })).resolves.not.toThrow();
            expect(s3Client.send).toHaveBeenCalledWith(expect.any(client_s3_1.DeleteObjectCommand));
        });
        it('파일이 없을 경우', async () => {
            s3Client.send.mockRejectedValue({ name: 'NotFound' });
            await expect(service.deleteObject({ bucket: 'test-bucket', key: 'test-key' })).resolves.not.toThrow();
        });
    });
});
//# sourceMappingURL=storage.service.spec.js.map