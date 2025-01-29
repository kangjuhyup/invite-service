import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { TemplateRepository } from '@app/database/repository/template';
import { AttachmentRepository } from '@app/database/repository/attachment';
import { mock, instance, when, verify, anything, deepEqual } from 'ts-mockito';
import { AttachmentEntity } from '@app/database/entity/attachment/attachment';
import { MetadataEntity } from '@app/database/entity/attachment/metadata';
import { TemplateAttachmentEntity } from '@app/database/entity/template/template.attachment';
import { TemplateEntity } from '@app/database/entity/template/template';
import { InsertTemplateTransaction } from '../insert.transaction';
import { LetterAttachmentCode } from '@app/util/attachment';
import { LetterEntity } from '@app/database/entity/letter/letter';

describe('InsertTemplateTransaction', () => {
  let transaction: InsertTemplateTransaction;
  let mockDataSource: DataSource;
  let mockTemplateRepository: TemplateRepository;
  let mockAttachmentRepository: AttachmentRepository;
  let mockEntityManager: EntityManager;
  let mockQueryRunner: QueryRunner;

  beforeEach(async () => {
    // Mock 객체 생성
    mockDataSource = mock(DataSource);
    mockTemplateRepository = mock(TemplateRepository);
    mockAttachmentRepository = mock(AttachmentRepository);
    mockEntityManager = mock(EntityManager);
    mockQueryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: instance(mockEntityManager),
    } as unknown as QueryRunner;

    // QueryRunner 설정
    when(mockDataSource.createQueryRunner()).thenReturn(mockQueryRunner);

    // Mock 템플릿 삽입 설정
    when(mockTemplateRepository.insertTemplate(anything())).thenResolve({
      identifiers: [{ templateId: 1 }],
      generatedMaps: [{ templateId: 1 }],
      raw: [{ templateId: 1 }],
    });

    // Mock 첨부파일 삽입 설정
    when(mockAttachmentRepository.insertAttachment(anything())).thenResolve({
      identifiers: [{ attachmentId: 1 }],
      generatedMaps: [{ attachmentId: 1 }],
      raw: [{ attachmentId: 1 }],
    });

    // Mock 메타데이터 삽입 설정
    when(mockAttachmentRepository.insertMetadata(anything())).thenResolve({
      identifiers: [{ metadataId: 1 }],
      generatedMaps: [{ metadataId: 1 }],
      raw: [{ metadataId: 1 }],
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsertTemplateTransaction,
        {
          provide: DataSource,
          useValue: instance(mockDataSource),
        },
        {
          provide: TemplateRepository,
          useValue: instance(mockTemplateRepository),
        },
        {
          provide: AttachmentRepository,
          useValue: instance(mockAttachmentRepository),
        },
      ],
    }).compile();

    transaction = module.get<InsertTemplateTransaction>(InsertTemplateTransaction);
  });

  describe('run', () => {
    it('템플릿과 첨부파일을 성공적으로 삽입해야 합니다', async () => {
      // Given
      const mockLetter = {
        letterId: 1,
        userId: 'test-user',
        letterAttachment: [
          {
            attachmentCode: LetterAttachmentCode.THUMBNAIL,
            attachment: {
              attachmentPath: 'path/to/thumbnail',
              metadata: {
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                z: 0,
                angle: 0,
              },
            },
          },
          {
            attachmentCode: LetterAttachmentCode.BACKGROUND,
            attachment: {
              attachmentPath: 'path/to/background',
              metadata: {
                width: 800,
                height: 600,
                x: 0,
                y: 0,
                z: -1,
                angle: 0,
              },
            },
          },
          {
            attachmentCode: LetterAttachmentCode.COMPONENT,
            attachment: {
              attachmentPath: 'path/to/component1',
              metadata: {
                width: 50,
                height: 50,
                x: 20,
                y: 20,
                z: 1,
                angle: 45,
              },
            },
          },
        ],
      } as unknown as LetterEntity;

      const input = {
        title: '새 템플릿',
        userId: 'test-user',
        letterEntity: mockLetter,
        thumbnailAttachment: {
          attachmentPath: 'path/to/thumbnail',
          attachmentCode: LetterAttachmentCode.THUMBNAIL,
          width: 100,
          height: 100,
          x: 0,
          y: 0,
          z: 0,
          angle: 0,
        },
        backgroundAttachment: {
          attachmentPath: 'path/to/background',
          attachmentCode: LetterAttachmentCode.BACKGROUND,
          width: 800,
          height: 600,
          x: 0,
          y: 0,
          z: -1,
          angle: 0,
        },
        componentAttachments: [
          {
            attachmentPath: 'path/to/component1',
            attachmentCode: LetterAttachmentCode.COMPONENT,
            width: 50,
            height: 50,
            x: 20,
            y: 20,
            z: 1,
            angle: 45,
          },
        ],
      };

      // When
      const result = await transaction.run(input);

      // Then
      expect(result).toBe(1);

      // QueryRunner 검증
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledWith('REPEATABLE READ');
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();

      // 템플릿 첨부파일 관계 삽입 검증
      verify(
        mockTemplateRepository.bulkInsertTemplateAttachment(
          deepEqual({
            templateAttachments: [
              TemplateAttachmentEntity.of(
                1,
                input.thumbnailAttachment.attachmentCode,
                1,
                InsertTemplateTransaction.name,
              ),
              TemplateAttachmentEntity.of(
                1,
                input.backgroundAttachment.attachmentCode,
                1,
                InsertTemplateTransaction.name,
              ),
              TemplateAttachmentEntity.of(
                1,
                input.componentAttachments[0].attachmentCode,
                1,
                InsertTemplateTransaction.name,
              ),
            ],
            entityManager: instance(mockEntityManager),
          }),
        ),
      ).once();
    });

    it('템플릿 삽입 실패시 트랜잭션이 롤백되어야 합니다', async () => {
      // Given
      const error = new Error('템플릿 삽입 실패');
      when(mockTemplateRepository.insertTemplate(anything())).thenThrow(error);

      const mockLetter = {
        letterId: 1,
        userId: 'test-user',
        letterAttachment: [
          {
            attachmentCode: LetterAttachmentCode.THUMBNAIL,
            attachment: {
              attachmentPath: 'path/to/thumbnail',
              metadata: {
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                z: 0,
                angle: 0,
              },
            },
          },
          {
            attachmentCode: LetterAttachmentCode.BACKGROUND,
            attachment: {
              attachmentPath: 'path/to/background',
              metadata: {
                width: 800,
                height: 600,
                x: 0,
                y: 0,
                z: -1,
                angle: 0,
              },
            },
          },
        ],
      } as unknown as LetterEntity;

      const input = {
        title: '새 템플릿',
        userId: 'test-user',
        letterEntity: mockLetter,
        thumbnailAttachment: {
          attachmentPath: 'path/to/thumbnail',
          attachmentCode: LetterAttachmentCode.THUMBNAIL,
          width: 100,
          height: 100,
          x: 0,
          y: 0,
          z: 0,
          angle: 0,
        },
        backgroundAttachment: {
          attachmentPath: 'path/to/background',
          attachmentCode: LetterAttachmentCode.BACKGROUND,
          width: 800,
          height: 600,
          x: 0,
          y: 0,
          z: -1,
          angle: 0,
        },
        componentAttachments: [],
      };

      // When & Then
      await expect(transaction.run(input)).rejects.toThrow(error);

      // QueryRunner 검증
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledWith('REPEATABLE READ');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();

      // 첨부파일 삽입이 호출되지 않았는지 검증
      verify(mockAttachmentRepository.insertAttachment(anything())).never();
      verify(mockAttachmentRepository.insertMetadata(anything())).never();
    });
  });
});
