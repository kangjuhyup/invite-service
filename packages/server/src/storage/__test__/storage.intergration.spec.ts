import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from '../storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [StorageService],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  describe('Storage 통합 테스트', () => {
    it('Presigned Url 생성', async () => {
      const url = await service.generateUploadPresignedUrl({
        bucket: 'thm',
        key: 'test-key',
        expires: 3600,
        meta: {
          session: 'test',
          width: 100,
          height: 100,
        },
      });

      expect(url).toContain('https://');
      expect(url).toContain('test-key');
    });
  });
});
