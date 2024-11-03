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
var InsertLetterTransaction_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertLetterTransaction = void 0;
const attachment_1 = require("../../../database/repository/attachment");
const letter_1 = require("../../../database/repository/letter");
const transaction_base_1 = require("../../../database/transaction.base");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let InsertLetterTransaction = InsertLetterTransaction_1 = class InsertLetterTransaction extends transaction_base_1.BaseTransaction {
    constructor(ds, letterRepository, attachmentRepository) {
        super(ds);
        this.ds = ds;
        this.letterRepository = letterRepository;
        this.attachmentRepository = attachmentRepository;
        this.creator = InsertLetterTransaction_1.name;
    }
    async execute({ letter, thumbnailAttachment, letterAttachment, backgroundAttachment, componentAttachments, }, entityManager) {
        const letterId = await this._insertLetter({ ...letter, creator: this.creator, updator: this.creator }, entityManager);
        const [thumbnailId, letterAttachmentId, backgroundAttachmentId, ...componentAttachmentIds] = await Promise.all([
            this._insertAttachment(thumbnailAttachment, entityManager),
            this._insertAttachment(letterAttachment, entityManager),
            this._insertAttachment(backgroundAttachment, entityManager),
            ...componentAttachments.map((c) => this._insertAttachment(c, entityManager)),
        ]);
        const allAttachments = [
            { attachmentId: thumbnailId, ...thumbnailAttachment },
            { attachmentId: letterAttachmentId, ...letterAttachment },
            { attachmentId: backgroundAttachmentId, ...backgroundAttachment },
            ...componentAttachmentIds.map((id, index) => ({
                attachmentId: id,
                ...componentAttachments[index],
            })),
        ];
        await this._insertLetterAttachments(letterId, allAttachments, entityManager);
        return letterId;
    }
    async _insertLetter(letter, entityManager) {
        const result = await this.letterRepository.insertLetter({
            letter,
            entityManager,
        });
        return result.identifiers[0].letterId;
    }
    async _insertAttachment(attachmentDetail, entityManager) {
        const attachment = {
            attachmentPath: attachmentDetail.attachmentPath,
            creator: this.creator,
            updator: this.creator,
        };
        const result = await this.attachmentRepository.insertAttachment({
            attachment,
            entityManager,
        });
        return result.identifiers[0].attachmentId;
    }
    async _insertLetterAttachments(letterId, attachments, entityManager) {
        const letterAttachments = attachments.map((a) => ({
            letterId,
            attachmentId: a.attachmentId,
            attachmentCode: a.attachmentCode,
            angle: a.angle,
            width: a.width,
            height: a.height,
            x: a.x,
            y: a.y,
            z: a.z,
            creator: this.creator,
            updator: this.creator,
        }));
        await this.letterRepository.insertLetterAttachment({
            letterAttachments,
            entityManager,
        });
    }
};
exports.InsertLetterTransaction = InsertLetterTransaction;
exports.InsertLetterTransaction = InsertLetterTransaction = InsertLetterTransaction_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        letter_1.LetterRepository,
        attachment_1.AttachmentRepository])
], InsertLetterTransaction);
//# sourceMappingURL=insert.letter.js.map