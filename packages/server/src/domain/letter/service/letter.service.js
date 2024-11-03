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
var LetterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterService = void 0;
const storage_service_1 = require("../../../storage/storage.service");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const redis_client_service_1 = require("../../../redis/redis.client.service");
const random_1 = require("../../../util/random");
const insert_letter_1 = require("../transaction/insert.letter");
const yn_1 = require("../../../util/yn");
const letter_1 = require("../../../database/repository/letter");
const attachment_1 = require("../../../util/attachment");
const letter_base_service_1 = require("./letter.base.service");
const letter_attachment_service_1 = require("./letter.attachment.service");
let LetterService = LetterService_1 = class LetterService extends letter_base_service_1.LetterBaseService {
    constructor(storage, redis, letterAttachmentService, letterRepository, insertLetterTransaction) {
        super();
        this.storage = storage;
        this.redis = redis;
        this.letterAttachmentService = letterAttachmentService;
        this.letterRepository = letterRepository;
        this.insertLetterTransaction = insertLetterTransaction;
        this.logger = new common_1.Logger(LetterService_1.name);
    }
    async getLetters({ limit, skip }, user) {
        const letters = await this.letterRepository.selectLetterFromUser({
            userId: user.id,
            limit,
            skip,
        });
        return {
            totalCount: letters[1],
            items: letters[0].map((letter) => {
                return {
                    id: letter.letterId,
                    title: letter.title,
                    category: letter.letterCategoryCode,
                    thumbnail: letter.letterAttachment[0]?.attachment.attachmentPath,
                };
            }),
        };
    }
    async getLetterDetail(id) {
        const letter = await this.letterRepository.selectLetterFromId({
            letterId: id,
        });
        const bg = letter.letterAttachment.find((la) => la.attachmentCode === attachment_1.LetterAttachmentCode.BACKGROUND);
        const cmps = letter.letterAttachment.filter((la) => la.attachmentCode === attachment_1.LetterAttachmentCode.COMPONENT);
        return {
            title: letter.title,
            body: letter.body,
            background: {
                path: bg.attachment.attachmentPath,
                width: bg.width,
                height: bg.height,
            },
            components: cmps.map((c) => ({
                path: c.attachment.attachmentPath,
                width: c.width,
                height: c.height,
                x: c.x,
                y: c.y,
                z: c.z,
                ang: c.angle,
            })),
        };
    }
    async prepareAddLetter({ thumbnailMeta, backgroundMeta, letterMeta, componentMetas, }, user) {
        const uuid = (0, uuid_1.v4)();
        const sessionKey = (0, random_1.randomString)(5);
        const thumbnailUrl = await this.storage.generateUploadPresignedUrl({
            bucket: this.thumbnailBucket,
            key: uuid,
            expires: this.urlExpires,
            meta: {
                session: sessionKey,
                ...thumbnailMeta,
            },
        });
        const letterUrl = await this.storage.generateUploadPresignedUrl({
            bucket: this.letterBucket,
            key: uuid,
            expires: this.urlExpires,
            meta: { session: sessionKey, ...letterMeta },
        });
        const backgroundUrl = await this.storage.generateUploadPresignedUrl({
            bucket: this.backGroundBucket,
            key: uuid,
            expires: this.urlExpires,
            meta: { session: sessionKey, ...backgroundMeta },
        });
        const componentUrls = [];
        componentMetas.forEach(async (componentMeta, i) => {
            componentUrls.push(await this.storage.generateUploadPresignedUrl({
                bucket: this.componentBucket,
                key: uuid + '-' + i,
                expires: this.urlExpires,
                meta: { session: sessionKey, ...componentMeta },
            }));
        });
        await this.redis.set(this.redis.generateKey(LetterService_1.name, `add-${user.id}`), {
            sessionKey: sessionKey,
            objectKey: uuid,
            componentCount: componentMetas.length,
        }, 70);
        return {
            thumbnailUrl,
            letterUrl,
            backgroundUrl,
            componentUrls,
            expires: this.urlExpires,
            sessionKey,
        };
    }
    async addLetter({ category, title, body, commentYn, attendYn }, user) {
        this.logger.debug(`addLetter start`);
        const session = await this.redis.get(this.redis.generateKey(LetterService_1.name, `add-${user.id}`));
        if (!session)
            throw new common_1.BadRequestException('필수 요청이 누락되었습니다.');
        const { sessionKey, objectKey, componentCount } = session;
        const { thumbnailMeta, letterMeta, backgroundMeta, componentMetas } = await this.letterAttachmentService.validateSessionAndRetrieveMetadata(sessionKey, objectKey, componentCount);
        const letterId = await this.insertLetterTransaction.run({
            letter: {
                userId: user.id,
                letterCategoryCode: category,
                body,
                title,
                commentYn: (0, yn_1.booleanToYN)(commentYn),
                attendYn: (0, yn_1.booleanToYN)(attendYn),
            },
            thumbnailAttachment: this.letterAttachmentService.createAttachmentDetail(thumbnailMeta, this.thumbnailBucket, attachment_1.LetterAttachmentCode.THUMBNAIL, objectKey),
            backgroundAttachment: this.letterAttachmentService.createAttachmentDetail(backgroundMeta, this.backGroundBucket, attachment_1.LetterAttachmentCode.BACKGROUND, objectKey),
            letterAttachment: this.letterAttachmentService.createAttachmentDetail(letterMeta, this.letterBucket, attachment_1.LetterAttachmentCode.LETTER, objectKey),
            componentAttachments: componentMetas.map((component, idx) => this.letterAttachmentService.createAttachmentDetail(component, this.componentBucket, attachment_1.LetterAttachmentCode.COMPONENT, `${objectKey}-${idx}`)),
        });
        return {
            letterId,
        };
    }
};
exports.LetterService = LetterService;
exports.LetterService = LetterService = LetterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService,
        redis_client_service_1.RedisClientService,
        letter_attachment_service_1.LetterAttachmentService,
        letter_1.LetterRepository,
        insert_letter_1.InsertLetterTransaction])
], LetterService);
//# sourceMappingURL=letter.service.js.map