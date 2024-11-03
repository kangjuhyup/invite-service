"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const storage_service_1 = require("../../../storage/storage.service");
const redis_client_service_1 = require("../../../redis/redis.client.service");
const letter_1 = require("../../../database/repository/letter");
const insert_letter_1 = require("../transaction/insert.letter");
const common_1 = require("@nestjs/common");
const letter_service_1 = require("../service/letter.service");
const letter_attachment_service_1 = require("../service/letter.attachment.service");
describe('LetterService', () => {
    let service;
    let storageService;
    let redisService;
    let letterAttachmentService;
    let letterRepository;
    let insertLetterTransaction;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                letter_service_1.LetterService,
                {
                    provide: storage_service_1.StorageService,
                    useValue: {
                        generateUploadPresignedUrl: jest.fn(),
                    },
                },
                {
                    provide: redis_client_service_1.RedisClientService,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        generateKey: jest.fn((serviceName, key) => `${serviceName}:${key}`),
                    },
                },
                {
                    provide: letter_attachment_service_1.LetterAttachmentService,
                    useValue: {
                        validateSessionAndRetrieveMetadata: jest.fn(),
                        createAttachmentDetail: jest.fn(),
                    },
                },
                {
                    provide: letter_1.LetterRepository,
                    useValue: {
                        selectLetterFromUser: jest.fn(),
                        selectLetterFromId: jest.fn(),
                    },
                },
                {
                    provide: insert_letter_1.InsertLetterTransaction,
                    useValue: {
                        run: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get(letter_service_1.LetterService);
        storageService = module.get(storage_service_1.StorageService);
        redisService = module.get(redis_client_service_1.RedisClientService);
        letterAttachmentService = module.get(letter_attachment_service_1.LetterAttachmentService);
        letterRepository = module.get(letter_1.LetterRepository);
        insertLetterTransaction = module.get(insert_letter_1.InsertLetterTransaction);
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
            letterRepository.selectLetterFromUser.mockResolvedValue([
                mockLetters,
                2,
            ]);
            const user = { id: 'mock' };
            const request = { limit: 10, skip: 0 };
            const response = await service.getLetters(request, user);
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
            const user = { id: 'mock' };
            const request = {
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
            storageService.generateUploadPresignedUrl.mockResolvedValue(mockPresignedUrl);
            redisService.set.mockResolvedValue(true);
            redisService.generateKey.mockImplementation((serviceName, key) => `${serviceName}:${key}`);
            const response = await service.prepareAddLetter(request, user);
            expect(storageService.generateUploadPresignedUrl).toHaveBeenCalledTimes(3 + 1);
            expect(redisService.set).toHaveBeenCalledWith('LetterService:add-mock', {
                sessionKey: expect.any(String),
                objectKey: expect.any(String),
                componentCount: 2,
            }, 70);
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
            const user = { id: 'mock' };
            const request = {
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
            const mockThumbnailDetail = {
                attachmentPath: 'thumbnailBucket/uuid1234',
                attachmentCode: 'LA001',
                width: 100,
                height: 200,
                x: 0,
                y: 0,
                z: 0,
                angle: 0,
            };
            const mockLetterDetail = {
                attachmentPath: 'letterBucket/uuid1234',
                attachmentCode: 'LA002',
                width: 300,
                height: 400,
                x: 0,
                y: 0,
                z: 0,
                angle: 0,
            };
            const mockBackgroundDetail = {
                attachmentPath: 'backgroundBucket/uuid1234',
                attachmentCode: 'LA003',
                width: 500,
                height: 600,
                x: 0,
                y: 0,
                z: 0,
                angle: 0,
            };
            const mockComponentDetails = [
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
            redisService.get.mockResolvedValue(mockSession);
            letterAttachmentService.validateSessionAndRetrieveMetadata.mockResolvedValue(mockMetadata);
            letterAttachmentService.createAttachmentDetail
                .mockImplementationOnce(() => mockThumbnailDetail)
                .mockImplementationOnce(() => mockBackgroundDetail)
                .mockImplementationOnce(() => mockLetterDetail)
                .mockImplementation((component, bucket, code, key) => {
                const index = key.split('-')[1];
                return mockComponentDetails[parseInt(index, 10)];
            });
            insertLetterTransaction.run.mockResolvedValue(1);
            const response = await service.addLetter(request, user);
            expect(redisService.get).toHaveBeenCalledWith('LetterService:add-mock');
            expect(letterAttachmentService.validateSessionAndRetrieveMetadata).toHaveBeenCalledWith(mockSession.sessionKey, mockSession.objectKey, mockSession.componentCount);
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
            const user = { id: 'mock' };
            const request = {
                category: 'LT001',
                title: 'Test Title',
                body: 'Test Body',
                commentYn: true,
                attendYn: false,
            };
            redisService.get.mockResolvedValue(null);
            await expect(service.addLetter(request, user)).rejects.toThrow(common_1.BadRequestException);
            expect(redisService.get).toHaveBeenCalledWith('LetterService:add-mock');
        });
    });
});
//# sourceMappingURL=letter.service.spec.js.map