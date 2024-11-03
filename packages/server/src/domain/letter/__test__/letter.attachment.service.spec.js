"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const storage_service_1 = require("../../../storage/storage.service");
const common_1 = require("@nestjs/common");
const attachment_1 = require("../../../util/attachment");
const letter_attachment_service_1 = require("../service/letter.attachment.service");
describe('LetterAttachmentService', () => {
    let service;
    let storageService;
    let logger;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                letter_attachment_service_1.LetterAttachmentService,
                {
                    provide: storage_service_1.StorageService,
                    useValue: {
                        getObjectMetadata: jest.fn(),
                        deleteObject: jest.fn(),
                    },
                },
                common_1.Logger,
            ],
        }).compile();
        service = module.get(letter_attachment_service_1.LetterAttachmentService);
        storageService = module.get(storage_service_1.StorageService);
        logger = module.get(common_1.Logger);
        jest.spyOn(logger, 'error').mockImplementation(() => { });
        jest.spyOn(logger, 'warn').mockImplementation(() => { });
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
            storageService.getObjectMetadata
                .mockResolvedValueOnce(mockMetadata.thumbnailMeta)
                .mockResolvedValueOnce(mockMetadata.letterMeta)
                .mockResolvedValueOnce(mockMetadata.backgroundMeta)
                .mockResolvedValueOnce(mockMetadata.componentMetas[0])
                .mockResolvedValueOnce(mockMetadata.componentMetas[1]);
            const metadata = await service.validateSessionAndRetrieveMetadata(sessionKey, objectKey, componentCount);
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
                    { 'x-amz-session-key': 'invalidSessionKey' },
                    { 'x-amz-session-key': 'validSessionKey' },
                ],
            };
            storageService.getObjectMetadata
                .mockResolvedValueOnce(mockMetadata.thumbnailMeta)
                .mockResolvedValueOnce(mockMetadata.letterMeta)
                .mockResolvedValueOnce(mockMetadata.backgroundMeta)
                .mockResolvedValueOnce(mockMetadata.componentMetas[0])
                .mockResolvedValueOnce(mockMetadata.componentMetas[1]);
            await expect(service.validateSessionAndRetrieveMetadata(sessionKey, objectKey, componentCount)).rejects.toThrow(common_1.UnauthorizedException);
            expect(storageService.deleteObject).toHaveBeenCalledTimes(5);
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
            const code = attachment_1.LetterAttachmentCode.THUMBNAIL;
            const objectKey = 'uuid1234';
            const expectedDetail = {
                attachmentPath: 'thumbnailBucket/uuid1234',
                attachmentCode: attachment_1.LetterAttachmentCode.THUMBNAIL,
                width: 100,
                height: 200,
                x: 10,
                y: 20,
                z: 0,
                angle: 30,
            };
            const detail = service.createAttachmentDetail(meta, bucket, code, objectKey);
            expect(detail).toEqual(expectedDetail);
            expect(storageService.deleteObject).not.toHaveBeenCalled();
        });
        it('필수 메타데이터 누락', () => {
            const meta = {
                'x-amx-height': '200',
            };
            const bucket = 'thumbnailBucket';
            const code = attachment_1.LetterAttachmentCode.THUMBNAIL;
            const objectKey = 'uuid1234';
            expect(() => service.createAttachmentDetail(meta, bucket, code, objectKey)).toThrow(common_1.BadRequestException);
            expect(storageService.deleteObject).toHaveBeenCalledWith({
                bucket,
                key: objectKey,
            });
        });
    });
});
//# sourceMappingURL=letter.attachment.service.spec.js.map