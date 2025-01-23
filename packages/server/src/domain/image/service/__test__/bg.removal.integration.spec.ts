import { Test, TestingModule } from '@nestjs/testing';
import { BackgroundRemovalService } from '../bg.removal.service';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('BackgroundRemovalService (Integration)', () => {
  let service: BackgroundRemovalService;
  const PROJECT_ROOT = path.join(__dirname, '../../../../../');
  const TEST_ASSETS_DIR = path.join(
    PROJECT_ROOT,
    'src',
    'domain',
    'image',
    'service',
    '__test__',
  );
  const TEST_IMAGE_NAME = 'test-image.jpg';
  const RESULT_IMAGE_NAME = 'result-image.jpg';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackgroundRemovalService],
    }).compile();

    service = module.get<BackgroundRemovalService>(BackgroundRemovalService);
    service.onModuleInit();
  });

  describe('실제 배경 제거 테스트', () => {
    let testImageBuffer: Buffer;

    beforeAll(async () => {
      // 테스트 assets 디렉토리 생성
      await fs.mkdir(TEST_ASSETS_DIR, { recursive: true });

      const testImagePath = path.join(TEST_ASSETS_DIR, TEST_IMAGE_NAME);

      try {
        testImageBuffer = await fs.readFile(testImagePath);
      } catch (error) {
        console.warn('테스트 이미지가 없습니다. 테스트 이미지를 준비해주세요.');
        console.warn(`예상 경로: ${testImagePath}`);

        // 테스트 이미지 다운로드
        const response = await fetch(
          'https://raw.githubusercontent.com/imgly/background-removal-js/main/example/example.jpg',
        );
        testImageBuffer = Buffer.from(await response.arrayBuffer());

        // 테스트 이미지 저장
        await fs.writeFile(testImagePath, testImageBuffer);
        console.log(`테스트 이미지가 다운로드되었습니다: ${testImagePath}`);
      }
    });

    it('실제 이미지의 배경이 제거되어야 함', async () => {
      // given
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: TEST_IMAGE_NAME,
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: testImageBuffer,
        size: testImageBuffer.length,
        destination: '',
        filename: '',
        path: '',
        stream: null,
      };

      // when
      const result = await service.removeBackground(mockFile);

      // then
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      // 결과 이미지 저장
      const resultPath = path.join(TEST_ASSETS_DIR, RESULT_IMAGE_NAME);
      await fs.writeFile(resultPath, result);
      console.log(`결과 이미지가 저장되었습니다: ${resultPath}`);
    }, 30000);

    afterAll(async () => {
      try {
        // 결과 이미지만 삭제 (테스트 이미지는 재사용을 위해 유지)
        await fs.unlink(path.join(TEST_ASSETS_DIR, RESULT_IMAGE_NAME));
      } catch (error) {
        // 파일이 없어도 무시
      }
    });
  });
});
