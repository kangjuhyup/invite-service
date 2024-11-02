import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from '@storage/storage.service';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

describe('StorageService', () => {
  let service: StorageService;
  let configService: ConfigService;
  let s3Client: S3Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
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

    service = module.get<StorageService>(StorageService);
    configService = module.get<ConfigService>(ConfigService);
    s3Client = service['s3Client'];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('presignedUrl 생성', () => {
    it('다운로드 Url 생성', async () => {
      (getSignedUrl as jest.Mock).mockResolvedValue(
        'https://presigned-download-url',
      );

      const url = await service.generateDownloadPresignedUrl({
        bucket: 'test-bucket',
        key: 'test-key',
        expires: 3600,
      });

      expect(getSignedUrl).toHaveBeenCalledWith(
        s3Client,
        expect.any(GetObjectCommand),
        { expiresIn: 3600 },
      );
      expect(url).toBe('https://presigned-download-url');
    });
    it('업로드 Url 생성', async () => {
      (getSignedUrl as jest.Mock).mockResolvedValue(
        'https://presigned-upload-url',
      );

      const url = await service.generateUploadPresignedUrl({
        bucket: 'test-bucket',
        key: 'test-key',
        expires: 3600,
      });

      expect(getSignedUrl).toHaveBeenCalledWith(
        s3Client,
        expect.any(PutObjectCommand),
        { expiresIn: 3600 },
      );
      expect(url).toBe('https://presigned-upload-url');
    });
  });

  describe('메타데이터 조회', () => {
    it('파일이 있을 경우', async () => {
      const mockMetadata = { ContentLength: 12345 };
      (s3Client.send as jest.Mock).mockResolvedValue(mockMetadata);

      const metadata = await service.getObjectMetadata({
        bucket: 'test-bucket',
        key: 'test-key',
      });

      expect(s3Client.send).toHaveBeenCalledWith(expect.any(HeadObjectCommand));
      expect(metadata).toEqual(mockMetadata);
    });

    it('파일이 없을 경우', async () => {
      (s3Client.send as jest.Mock).mockRejectedValue({ name: 'NotFound' });

      const metadata = await service.getObjectMetadata({
        bucket: 'test-bucket',
        key: 'test-key',
      });

      expect(metadata).toBeUndefined();
    });
  });

  describe('파일 삭제', () => {
    it('파일이 있을 경우', async () => {
      (s3Client.send as jest.Mock).mockResolvedValue({});

      await expect(
        service.deleteObject({ bucket: 'test-bucket', key: 'test-key' }),
      ).resolves.not.toThrow();

      expect(s3Client.send).toHaveBeenCalledWith(
        expect.any(DeleteObjectCommand),
      );
    });

    it('파일이 없을 경우', async () => {
      (s3Client.send as jest.Mock).mockRejectedValue({ name: 'NotFound' });

      await expect(
        service.deleteObject({ bucket: 'test-bucket', key: 'test-key' }),
      ).resolves.not.toThrow();
    });
  });
});
