// src/letter/service/letter.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from 'packages/server/src/storage/storage.service';
import { RedisClientService } from 'packages/server/src/redis/redis.client.service';
import { LetterRepository } from 'packages/server/src/database/repository/letter';
import { InsertLetterTransaction } from '../transaction/insert.letter';
import { BadRequestException } from '@nestjs/common';
import { User } from 'packages/server/src/jwt/user';
import { PrepareRequest } from '../dto/request/prepare';
import { PrepareResponse } from '../dto/response/prepare';
import { AddLetterRequest } from '../dto/request/add.letter';
import { AddLetterResponse } from '../dto/response/add.letter';
import { GetLetterPageRequest } from '../dto/request/get.page';
import { GetLetterPageResponse } from '../dto/response/get.page';
import { AttachmentDetail } from '../transaction/insert.letter';
import { LetterService } from '../service/letter.service';
import { LetterAttachmentService } from '../service/letter.attachment.service';

describe('LetterService', () => {
  let service: LetterService;
  let storageService: StorageService;
  let redisService: RedisClientService;
  let letterAttachmentService: LetterAttachmentService;
  let letterRepository: LetterRepository;
  let insertLetterTransaction: InsertLetterTransaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LetterService,
        {
          provide: StorageService,
          useValue: {
            generateUploadPresignedUrl: jest.fn(),
          },
        },
        {
          provide: RedisClientService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            generateKey: jest.fn(
              (serviceName: string, key: string) => `${serviceName}:${key}`,
            ),
          },
        },
        {
          provide: LetterAttachmentService,
          useValue: {
            validateSessionAndRetrieveMetadata: jest.fn(),
            createAttachmentDetail: jest.fn(),
          },
        },
        {
          provide: LetterRepository,
          useValue: {
            selectLetterFromUser: jest.fn(),
            selectLetterFromId: jest.fn(),
          },
        },
        {
          provide: InsertLetterTransaction,
          useValue: {
            run: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LetterService>(LetterService);
    storageService = module.get<StorageService>(StorageService);
    redisService = module.get<RedisClientService>(RedisClientService);
    letterAttachmentService = module.get<LetterAttachmentService>(
      LetterAttachmentService,
    );
    letterRepository = module.get<LetterRepository>(LetterRepository);
    insertLetterTransaction = module.get<InsertLetterTransaction>(
      InsertLetterTransaction,
    );
  });

  describe('getLetters', () => {
    it('should return paginated letters', async () => {
      const mockLetters = [
        {
          letterId: 1,
          title: 'Test Letter 1',
          letterCategoryCode: 'CATEGORY1',
          letterAttachment: [
            { attachment: { attachmentPath: 'path/to/thumbnail1' } },
          ],
        },
        {
          letterId: 2,
          title: 'Test Letter 2',
          letterCategoryCode: 'CATEGORY2',
          letterAttachment: [
            { attachment: { attachmentPath: 'path/to/thumbnail2' } },
          ],
        },
      ];

      (letterRepository.selectLetterFromUser as jest.Mock).mockResolvedValue([
        mockLetters,
        2,
      ]);

      const user: User = { id: 'mock' };
      const request: GetLetterPageRequest = { limit: 10, skip: 0 };

      const response: GetLetterPageResponse = await service.getLetters(
        request,
        user,
      );

      expect(letterRepository.selectLetterFromUser).toHaveBeenCalledWith({
        userId: user.id,
        limit: request.limit,
        skip: request.skip,
      });

      expect(response).toEqual({
        totalCount: 2,
        items: [
          {
            id: 1,
            title: 'Test Letter 1',
            category: 'CATEGORY1',
            thumbnail: 'path/to/thumbnail1',
          },
          {
            id: 2,
            title: 'Test Letter 2',
            category: 'CATEGORY2',
            thumbnail: 'path/to/thumbnail2',
          },
        ],
      });
    });
  });

  describe('초대장 업로드 준비', () => {
    it('사인URL & 세션키 반환', async () => {
      const mockPresignedUrl = 'https://example.com/upload';
      const mockSessionKey = 'abcde';
      const user: User = { id: 'mock' } as User;
      const request: PrepareRequest = {
        thumbnailMeta: {
          width: '200',
          height: '100',
        },
        letterMeta: {
          width: '400',
          height: '800',
        },
        backgroundMeta: {
          width: '400',
          height: '800',
        },
        componentMetas: [
          {
            width: '100',
            height: '50',
            x: '100',
            y: '100',
            z: '0',
            angle: '0',
          },
        ],
      };

      (
        storageService.generateUploadPresignedUrl as jest.Mock
      ).mockResolvedValue(mockPresignedUrl);
      (redisService.set as jest.Mock).mockResolvedValue(true);

      (redisService.generateKey as jest.Mock).mockImplementation(
        (serviceName: string, key: string) => `${serviceName}:${key}`,
      );

      const response: PrepareResponse = await service.prepareAddLetter(
        request,
        user,
      );

      expect(storageService.generateUploadPresignedUrl).toHaveBeenCalledTimes(
        3 + 1,
      );
      expect(redisService.set).toHaveBeenCalledWith(
        'LetterService:add-mock',
        {
          sessionKey: expect.any(String),
          objectKey: expect.any(String),
          componentCount: 2,
        },
        70,
      );

      expect(response).toEqual({
        thumbnailUrl: mockPresignedUrl,
        letterUrl: mockPresignedUrl,
        backgroundUrl: mockPresignedUrl,
        componentUrls: [mockPresignedUrl, mockPresignedUrl],
        expires: service['urlExpires'],
        sessionKey: expect.any(String),
      });
    });
  });

  describe('초대장 업로드', () => {
    it('업로드 성공', async () => {
      const user: User = { id: 'mock' };
      const request: AddLetterRequest = {
        category: 'LT001',
        title: 'Test Title',
        body: 'Test Body',
        commentYn: true,
        attendYn: false,
      };

      const mockSession = {
        sessionKey: 'validSessionKey',
        objectKey: 'uuid1234',
        componentCount: 2,
      };

      const mockMetadata = {
        thumbnailMeta: {
          'x-amz-session-key': 'validSessionKey',
          'x-amx-width': '100',
          'x-amx-height': '200',
        },
        letterMeta: {
          'x-amz-session-key': 'validSessionKey',
          'x-amx-width': '300',
          'x-amx-height': '400',
        },
        backgroundMeta: {
          'x-amz-session-key': 'validSessionKey',
          'x-amx-width': '500',
          'x-amx-height': '600',
        },
        componentMetas: [
          {
            'x-amz-session-key': 'validSessionKey',
            'x-amx-width': '50',
            'x-amx-height': '60',
          },
          {
            'x-amz-session-key': 'validSessionKey',
            'x-amx-width': '70',
            'x-amx-height': '80',
          },
        ],
      };

      const mockThumbnailDetail: AttachmentDetail = {
        attachmentPath: 'thumbnailBucket/uuid1234',
        attachmentCode: 'LA001',
        width: 100,
        height: 200,
        x: 0,
        y: 0,
        z: 0,
        angle: 0,
      };

      const mockLetterDetail: AttachmentDetail = {
        attachmentPath: 'letterBucket/uuid1234',
        attachmentCode: 'LA002',
        width: 300,
        height: 400,
        x: 0,
        y: 0,
        z: 0,
        angle: 0,
      };

      const mockBackgroundDetail: AttachmentDetail = {
        attachmentPath: 'backgroundBucket/uuid1234',
        attachmentCode: 'LA003',
        width: 500,
        height: 600,
        x: 0,
        y: 0,
        z: 0,
        angle: 0,
      };

      const mockComponentDetails: AttachmentDetail[] = [
        {
          attachmentPath: 'componentBucket/uuid1234-0',
          attachmentCode: 'LA004',
          width: 50,
          height: 60,
          x: 0,
          y: 0,
          z: 0,
          angle: 0,
        },
        {
          attachmentPath: 'componentBucket/uuid1234-1',
          attachmentCode: 'LA004',
          width: 70,
          height: 80,
          x: 0,
          y: 0,
          z: 0,
          angle: 0,
        },
      ];

      (redisService.get as jest.Mock).mockResolvedValue(mockSession);
      (
        letterAttachmentService.validateSessionAndRetrieveMetadata as jest.Mock
      ).mockResolvedValue(mockMetadata);
      (letterAttachmentService.createAttachmentDetail as jest.Mock)
        .mockImplementationOnce(() => mockThumbnailDetail)
        .mockImplementationOnce(() => mockBackgroundDetail)
        .mockImplementationOnce(() => mockLetterDetail)
        .mockImplementation((component, bucket, code, key) => {
          const index = key.split('-')[1];
          return mockComponentDetails[parseInt(index, 10)];
        });
      (insertLetterTransaction.run as jest.Mock).mockResolvedValue(1);

      const response: AddLetterResponse = await service.addLetter(
        request,
        user,
      );

      expect(redisService.get).toHaveBeenCalledWith('LetterService:add-mock');
      expect(
        letterAttachmentService.validateSessionAndRetrieveMetadata,
      ).toHaveBeenCalledWith(
        mockSession.sessionKey,
        mockSession.objectKey,
        mockSession.componentCount,
      );
      expect(insertLetterTransaction.run).toHaveBeenCalledWith({
        letter: {
          userId: user.id,
          letterCategoryCode: request.category,
          body: request.body,
          title: request.title,
          commentYn: 'Y',
          attendYn: 'N',
        },
        thumbnailAttachment: mockThumbnailDetail,
        backgroundAttachment: mockBackgroundDetail,
        letterAttachment: mockLetterDetail,
        componentAttachments: mockComponentDetails,
      });
      expect(response).toEqual({ letterId: 1 });
    });

    it('초대장 준비 호출하지 않음', async () => {
      const user: User = { id: 'mock' };
      const request: AddLetterRequest = {
        category: 'LT001',
        title: 'Test Title',
        body: 'Test Body',
        commentYn: true,
        attendYn: false,
      };

      (redisService.get as jest.Mock).mockResolvedValue(null);

      await expect(service.addLetter(request, user)).rejects.toThrow(
        BadRequestException,
      );
      expect(redisService.get).toHaveBeenCalledWith('LetterService:add-mock');
    });
  });
});
