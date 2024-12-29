import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AttachmentDetail } from '../transaction/insert.letter';
import { StorageService } from '@app/storage/storage.service';
import { LetterAttachmentCode } from '@app/util/attachment';
import { LetterAttachmentService } from '../service/letter.attachment.service';

describe('LetterAttachmentService', () => {
  let service: LetterAttachmentService;
  let storageService: StorageService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LetterAttachmentService,
        {
          provide: StorageService,
          useValue: {
            getObjectMetadata: jest.fn(),
            deleteObject: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    service = module.get<LetterAttachmentService>(LetterAttachmentService);
    storageService = module.get<StorageService>(StorageService);
    logger = module.get<Logger>(Logger);
    jest.spyOn(logger, 'error').mockImplementation(() => {});
    jest.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  describe('첨부파일 세션키 검증', () => {
    it('세션키 일치', async () => {
      const sessionKey = 'validSessionKey';
      const objectKey = 'uuid1234';
      const componentCount = 2;

      const mockMetadata = {
        thumbnailMeta: { 'x-amz-session-key': 'validSessionKey' },
        letterMeta: { 'x-amz-session-key': 'validSessionKey' },
        backgroundMeta: { 'x-amz-session-key': 'validSessionKey' },
        componentMetas: [
          { 'x-amz-session-key': 'validSessionKey' },
          { 'x-amz-session-key': 'validSessionKey' },
        ],
      };

      (storageService.getObjectMetadata as jest.Mock)
        .mockResolvedValueOnce(mockMetadata.thumbnailMeta)
        .mockResolvedValueOnce(mockMetadata.letterMeta)
        .mockResolvedValueOnce(mockMetadata.backgroundMeta)
        .mockResolvedValueOnce(mockMetadata.componentMetas[0])
        .mockResolvedValueOnce(mockMetadata.componentMetas[1]);

      const metadata = await service.validateSessionAndRetrieveMetadata(
        sessionKey,
        objectKey,
        componentCount,
      );

      expect(metadata).toEqual(mockMetadata);
    });

    it('일치하지 않는 세션키 존재', async () => {
      const sessionKey = 'validSessionKey';
      const objectKey = 'uuid1234';
      const componentCount = 2;

      const mockMetadata = {
        thumbnailMeta: { 'x-amz-session-key': 'validSessionKey' },
        letterMeta: { 'x-amz-session-key': 'validSessionKey' },
        backgroundMeta: { 'x-amz-session-key': 'validSessionKey' },
        componentMetas: [
          { 'x-amz-session-key': 'invalidSessionKey' }, // Invalid session key
          { 'x-amz-session-key': 'validSessionKey' },
        ],
      };

      (storageService.getObjectMetadata as jest.Mock)
        .mockResolvedValueOnce(mockMetadata.thumbnailMeta)
        .mockResolvedValueOnce(mockMetadata.letterMeta)
        .mockResolvedValueOnce(mockMetadata.backgroundMeta)
        .mockResolvedValueOnce(mockMetadata.componentMetas[0])
        .mockResolvedValueOnce(mockMetadata.componentMetas[1]);

      await expect(
        service.validateSessionAndRetrieveMetadata(
          sessionKey,
          objectKey,
          componentCount,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(storageService.deleteObject).toHaveBeenCalledTimes(5); // thumbnail, letter, background, component1, component2
    });
  });

  describe('디테일 메타데이터 검증', () => {
    it('전체 메타데이터 존재', () => {
      const meta = {
        'x-amx-width': '100',
        'x-amx-height': '200',
        'x-amx-x': '10',
        'x-amx-y': '20',
        'x-amx-angle': '30',
      };
      const bucket = 'thumbnailBucket';
      const code = LetterAttachmentCode.THUMBNAIL;
      const objectKey = 'uuid1234';

      const expectedDetail: AttachmentDetail = {
        attachmentPath: 'thumbnailBucket/uuid1234',
        attachmentCode: LetterAttachmentCode.THUMBNAIL,
        width: 100,
        height: 200,
        x: 10,
        y: 20,
        z: 0,
        angle: 30,
      };

      const detail = service.createAttachmentDetail(
        meta,
        bucket,
        code,
        objectKey,
      );

      expect(detail).toEqual(expectedDetail);
      expect(storageService.deleteObject).not.toHaveBeenCalled();
    });

    it('필수 메타데이터 누락', () => {
      const meta = {
        'x-amx-height': '200',
      };
      const bucket = 'thumbnailBucket';
      const code = LetterAttachmentCode.THUMBNAIL;
      const objectKey = 'uuid1234';

      expect(() =>
        service.createAttachmentDetail(meta, bucket, code, objectKey),
      ).toThrow(BadRequestException);

      expect(storageService.deleteObject).toHaveBeenCalledWith({
        bucket,
        key: objectKey,
      });
    });
  });
});
