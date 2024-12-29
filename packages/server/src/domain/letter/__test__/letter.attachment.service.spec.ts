import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AttachmentDetail } from '../transaction/insert.letter';
import { StorageService } from '@app/storage/storage.service';
import { LetterAttachmentCode } from '@app/util/attachment';
import { LetterAttachmentService } from '../service/letter.attachment.service';

describe('LetterAttachmentService', () => {
  let service: LetterAttachmentService;
  let storageService: StorageService;

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
      ],
    }).compile();

    service = module.get<LetterAttachmentService>(LetterAttachmentService);
    storageService = module.get<StorageService>(StorageService);
  });

  describe('세션 검증 및 메타데이터 조회', () => {
    const sessionKey = 'test-session';
    const objectKey = 'test-object';
    const componentCount = 2;

    const mockMetadata = {
      thumbnailMeta: { Metadata: { session: 'test-session' } },
      letterMeta: { Metadata: { session: 'test-session' } },
      backgroundMeta: { Metadata: { session: 'test-session' } },
      componentMetas: [
        { Metadata: { session: 'test-session' } },
        { Metadata: { session: 'test-session' } },
      ],
    };

    it('유효한 세션키로 메타데이터를 성공적으로 조회해야 함', async () => {
      jest.spyOn(storageService, 'getObjectMetadata')
        .mockResolvedValueOnce(mockMetadata.thumbnailMeta)
        .mockResolvedValueOnce(mockMetadata.letterMeta)
        .mockResolvedValueOnce(mockMetadata.backgroundMeta)
        .mockResolvedValueOnce(mockMetadata.componentMetas[0])
        .mockResolvedValueOnce(mockMetadata.componentMetas[1]);

      const result = await service.validateSessionAndRetrieveMetadata(
        sessionKey,
        objectKey,
        componentCount,
      );

      expect(result).toEqual(mockMetadata);
      expect(storageService.getObjectMetadata).toHaveBeenCalledTimes(5);
    });

    it('세션키가 일치하지 않을 경우 파일을 삭제하고 예외를 발생시켜야 함', async () => {
      const invalidMetadata = {
        ...mockMetadata,
        thumbnailMeta: { Metadata: { session: 'invalid-session' } },
      };

      jest.spyOn(storageService, 'getObjectMetadata')
        .mockResolvedValueOnce(invalidMetadata.thumbnailMeta)
        .mockResolvedValueOnce(mockMetadata.letterMeta)
        .mockResolvedValueOnce(mockMetadata.backgroundMeta)
        .mockResolvedValueOnce(mockMetadata.componentMetas[0])
        .mockResolvedValueOnce(mockMetadata.componentMetas[1]);

      jest.spyOn(storageService, 'deleteObject').mockResolvedValue(undefined);

      await expect(
        service.validateSessionAndRetrieveMetadata(
          sessionKey,
          objectKey,
          componentCount,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(storageService.deleteObject).toHaveBeenCalled();
    });
  });

  describe('첨부파일 상세 정보 생성', () => {
    const mockMeta = {
      Metadata: {
        width: '100',
        height: '200',
        x: '10',
        y: '20',
        z: '30',
        angle: '45',
      },
    };

    it('유효한 메타데이터로 첨부파일 상세 정보를 생성해야 함', () => {
      const result = service.createAttachmentDetail(
        mockMeta,
        'test-bucket',
        LetterAttachmentCode.LETTER,
        'test-object',
      );

      const expectedDetail: AttachmentDetail = {
        attachmentPath: 'test-bucket/test-object',
        attachmentCode: LetterAttachmentCode.LETTER,
        width: 100,
        height: 200,
        x: 10,
        y: 20,
        z: 30,
        angle: 45,
      };

      expect(result).toEqual(expectedDetail);
    });

    it('필수 메타데이터가 없을 경우 파일을 삭제하고 예외를 발생시켜야 함', () => {
      const invalidMeta = {
        Metadata: {
          x: '10',
          y: '20',
        },
      };

      jest.spyOn(storageService, 'deleteObject').mockResolvedValue(undefined);

      expect(() =>
        service.createAttachmentDetail(
          invalidMeta,
          'test-bucket',
          LetterAttachmentCode.LETTER,
          'test-object',
        ),
      ).toThrow(BadRequestException);

      expect(storageService.deleteObject).toHaveBeenCalledWith({
        bucket: 'test-bucket',
        key: 'test-object',
      });
    });

    it('선택적 메타데이터가 없을 경우 기본값을 사용해야 함', () => {
      const metaWithoutOptional = {
        Metadata: {
          width: '100',
          height: '200',
        },
      };

      const result = service.createAttachmentDetail(
        metaWithoutOptional,
        'test-bucket',
        LetterAttachmentCode.LETTER,
        'test-object',
      );

      expect(result).toEqual({
        attachmentPath: 'test-bucket/test-object',
        attachmentCode: LetterAttachmentCode.LETTER,
        width: 100,
        height: 200,
        x: 0,
        y: 0,
        z: 0,
        angle: 0,
      });
    });
  });
});