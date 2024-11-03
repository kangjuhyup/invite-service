"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LetterAttachmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterAttachmentService = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("../../../storage/storage.service");
const letter_base_service_1 = require("./letter.base.service");
let LetterAttachmentService = LetterAttachmentService_1 = class LetterAttachmentService extends letter_base_service_1.LetterBaseService {
    constructor(storage) {
        super();
        this.storage = storage;
        this.logger = new common_1.Logger(LetterAttachmentService_1.name);
    }
    async validateSessionAndRetrieveMetadata(sessionKey, objectKey, componentCount) {
        const metadata = await this.getMetadata(objectKey, componentCount);
        if (metadata.thumbnailMeta.Metadata.session !== sessionKey ||
            metadata.letterMeta.Metadata.session !== sessionKey ||
            metadata.backgroundMeta.Metadata.session !== sessionKey ||
            metadata.componentMetas.some((c) => c.Metadata.session !== sessionKey)) {
            this.deleteInvalidObjects(metadata, objectKey);
            throw new common_1.UnauthorizedException('세션키가 일치하지 않습니다.');
        }
        return metadata;
    }
    async getMetadata(objectKey, componentCount) {
        const [thumbnailMeta, letterMeta, backgroundMeta] = await Promise.all([
            this.storage.getObjectMetadata({
                bucket: this.thumbnailBucket,
                key: objectKey,
            }),
            this.storage.getObjectMetadata({
                bucket: this.letterBucket,
                key: objectKey,
            }),
            this.storage.getObjectMetadata({
                bucket: this.backGroundBucket,
                key: objectKey,
            }),
        ]);
        const componentPromises = Array.from({ length: componentCount }, (_, i) => this.storage.getObjectMetadata({
            bucket: this.componentBucket,
            key: `${objectKey}-${i}`,
        }));
        const componentResults = await Promise.allSettled(componentPromises);
        const componentMetas = componentResults
            .filter((result) => result.status === 'fulfilled' && result.value)
            .map((result) => result.value);
        return { thumbnailMeta, letterMeta, backgroundMeta, componentMetas };
    }
    deleteInvalidObjects(metadata, objectKey) {
        const deletePromises = [
            this.storage.deleteObject({
                bucket: this.thumbnailBucket,
                key: objectKey,
            }),
            this.storage.deleteObject({
                bucket: this.letterBucket,
                key: objectKey,
            }),
            this.storage.deleteObject({
                bucket: this.backGroundBucket,
                key: objectKey,
            }),
        ];
        for (let i = 0; i < metadata.componentMetas.length; i++) {
            deletePromises.push(this.storage.deleteObject({
                bucket: this.componentBucket,
                key: `${objectKey}-${i}`,
            }));
        }
        Promise.allSettled(deletePromises).then((results) => {
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    this.logger.error(`파일 삭제 실패 (${index + 1}/${deletePromises.length}) => ${result.reason.message}`);
                }
            });
        });
    }
    createAttachmentDetail(meta, bucket, code, objectKey) {
        if (!meta.Metadata.width || !meta.Metadata.height) {
            this.storage.deleteObject({
                bucket,
                key: objectKey,
            });
            throw new common_1.BadRequestException('메타데이터에 필수값이 존재하지 않습니다.');
        }
        const detail = {
            attachmentPath: `${bucket}/${objectKey}`,
            attachmentCode: code,
            width: Number(meta.Metadata.width),
            height: Number(meta.Metadata.height),
            x: Number(meta.Metadata.x) || 0,
            y: Number(meta.Metadata.y) || 0,
            z: Number(meta.Metadata.z) || 0,
            angle: Number(meta.Metadata.angle) || 0,
        };
        return detail;
    }
};
exports.LetterAttachmentService = LetterAttachmentService;
exports.LetterAttachmentService = LetterAttachmentService = LetterAttachmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], LetterAttachmentService);
//# sourceMappingURL=letter.attachment.service.js.map