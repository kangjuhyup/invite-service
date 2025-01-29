import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { UpdateLetterTransaction } from '../update.letter';
import { LetterRepository } from '@app/database/repository/letter';
import { AttachmentRepository } from '@app/database/repository/attachment';
import { mock, instance, when, verify, anything, deepEqual } from 'ts-mockito';
import { LetterAttachmentCode } from '@app/util/attachment';
import { AttachmentEntity } from '@app/database/entity/attachment/attachment';
import { MetadataEntity } from '@app/database/entity/attachment/metadata';
import { LetterAttachmentEntity } from '@app/database/entity/letter/letter.attachment';

describe('UpdateLetterTransaction', () => {
  let transaction: UpdateLetterTransaction;
  let mockDataSource: DataSource;
  let mockLetterRepository: LetterRepository;
  let mockAttachmentRepository: AttachmentRepository;
  let mockEntityManager: EntityManager;
  let mockQueryRunner: QueryRunner;

  beforeEach(async () => {
    // Mock 객체 생성
    mockDataSource = mock(DataSource);
    mockLetterRepository = mock(LetterRepository);
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

    // Mock 레터 업데이트 설정
    when(mockLetterRepository.updateLetter(anything())).thenResolve();

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

    // Mock 레터 첨부파일 관계 설정
    when(mockLetterRepository.insertLetterAttachment(anything())).thenResolve();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateLetterTransaction,
        {
          provide: DataSource,
          useValue: instance(mockDataSource),
        },
        {
          provide: LetterRepository,
          useValue: instance(mockLetterRepository),
        },
        {
          provide: AttachmentRepository,
          useValue: instance(mockAttachmentRepository),
        },
      ],
    }).compile();

    transaction = module.get<UpdateLetterTransaction>(UpdateLetterTransaction);
  });

  describe('run', () => {
    it('레터와 첨부파일을 성공적으로 업데이트해야 합니다', async () => {
      // Given
      const input = {
        letter: {
          letterId: 1,
          title: '수정된 제목',
          content: '수정된 내용',
          commentYn: true,
          attendYn: false,
          publicYn: true,
        },
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
        letterAttachment: {
          attachmentPath: 'path/to/letter',
          attachmentCode: LetterAttachmentCode.LETTER,
          width: 200,
          height: 300,
          x: 10,
          y: 10,
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
      expect(result).toBe(1); // letterId 반환 확인

      // QueryRunner 검증
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledWith(
        'REPEATABLE READ',
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();

      // 레터 업데이트 검증
      verify(
        mockLetterRepository.updateLetter(
          deepEqual({
            ...input.letter,
            updator: UpdateLetterTransaction.name,
            entityManager: instance(mockEntityManager),
          }),
        ),
      ).once();

      // 첨부파일 삽입 검증
      verify(
        mockAttachmentRepository.insertAttachment(
          deepEqual({
            attachment: AttachmentEntity.of(
              input.thumbnailAttachment.attachmentPath,
              UpdateLetterTransaction.name,
            ),
            entityManager: instance(mockEntityManager),
          }),
        ),
      ).called();

      // 메타데이터 삽입 검증
      verify(
        mockAttachmentRepository.insertMetadata(
          deepEqual({
            metadata: MetadataEntity.of(
              UpdateLetterTransaction.name,
              1,
              input.thumbnailAttachment.angle,
              input.thumbnailAttachment.width,
              input.thumbnailAttachment.height,
              input.thumbnailAttachment.x,
              input.thumbnailAttachment.y,
              input.thumbnailAttachment.z,
            ),
            entityManager: instance(mockEntityManager),
          }),
        ),
      ).called();

      // 레터 첨부파일 관계 삽입 검증
      verify(
        mockLetterRepository.insertLetterAttachment(
          deepEqual({
            letterAttachments: [
              LetterAttachmentEntity.of(
                1,
                input.thumbnailAttachment.attachmentCode,
                1,
                UpdateLetterTransaction.name,
              ),
              LetterAttachmentEntity.of(
                1,
                input.letterAttachment.attachmentCode,
                1,
                UpdateLetterTransaction.name,
              ),
              LetterAttachmentEntity.of(
                1,
                input.backgroundAttachment.attachmentCode,
                1,
                UpdateLetterTransaction.name,
              ),
              LetterAttachmentEntity.of(
                1,
                input.componentAttachments[0].attachmentCode,
                1,
                UpdateLetterTransaction.name,
              ),
            ],
            entityManager: instance(mockEntityManager),
          }),
        ),
      ).once();
    });

    it('레터 업데이트 실패시 트랜잭션이 롤백되어야 합니다', async () => {
      // Given
      const error = new Error('레터 업데이트 실패');
      when(mockLetterRepository.updateLetter(anything())).thenThrow(error);

      const input = {
        letter: {
          letterId: 1,
          title: '수정된 제목',
        },
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
        letterAttachment: {
          attachmentPath: 'path/to/letter',
          attachmentCode: LetterAttachmentCode.LETTER,
          width: 200,
          height: 300,
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
          z: 0,
          angle: 0,
        },
        componentAttachments: [],
      };

      // When & Then
      await expect(transaction.run(input)).rejects.toThrow(error);

      // QueryRunner 검증
      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledWith(
        'REPEATABLE READ',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();

      // 첨부파일 삽입이 호출되지 않았는지 검증
      verify(mockAttachmentRepository.insertAttachment(anything())).never();
      verify(mockAttachmentRepository.insertMetadata(anything())).never();
    });
  });
});
