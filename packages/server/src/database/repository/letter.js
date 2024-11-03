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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterRepository = void 0;
const letter_1 = require("../entity/letter");
const letter_attachment_1 = require("../entity/letter.attachment");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const yn_1 = require("../../util/yn");
const default_1 = require("../column/default");
const letter_attachment_column_1 = require("../column/letter.attachment.column");
const attachment_1 = require("../../util/attachment");
let LetterRepository = class LetterRepository {
    constructor(letter, letterAttachment) {
        this.letter = letter;
        this.letterAttachment = letterAttachment;
    }
    async selectLetterFromUser({ userId, limit, skip, entityManager, }) {
        const repo = this._getRepository('letter', entityManager);
        return await repo
            .createQueryBuilder('letter')
            .leftJoinAndSelect('letter.letterAttachment', 'letterAttachment', `letterAttachment.${letter_attachment_column_1.LetterAttachmentColumn.attachmentCode} = :code`, { code: attachment_1.LetterAttachmentCode.THUMBNAIL })
            .leftJoinAndSelect('letterAttachment.attachment', 'attachment', `attachment.${default_1.DefaultColumn.useYn} = :useYn`, { useYn: yn_1.YN.Y })
            .where({ userId, useYn: yn_1.YN.Y })
            .orderBy('letter.createdAt', 'DESC')
            .limit(limit)
            .offset(skip)
            .getManyAndCount();
    }
    async selectLetterFromId({ letterId, entityManager, }) {
        const repo = this._getRepository('letter', entityManager);
        const qb = repo
            .createQueryBuilder('letter')
            .innerJoinAndSelect('letter.letterAttachment', 'letterAttachment', `letterAttachment.${default_1.DefaultColumn.useYn} = :useYn`, { useYn: yn_1.YN.Y })
            .innerJoinAndSelect('letterAttachment.attachment', 'attachment', `attachment.${default_1.DefaultColumn.useYn} = :useYn`, { useYn: yn_1.YN.Y })
            .innerJoinAndSelect('letter.user', 'user', `user.${default_1.DefaultColumn.useYn} = :useYn`, { useYn: yn_1.YN.Y })
            .where({ letterId, useYn: yn_1.YN.Y });
        return await qb.getOne();
    }
    async insertLetter({ letter, entityManager }) {
        const repo = this._getRepository('letter', entityManager);
        return await repo.insert(letter);
    }
    async insertLetterAttachment({ letterAttachments, entityManager, }) {
        const repo = this._getRepository('letterAttachment', entityManager);
        await repo
            .createQueryBuilder()
            .insert()
            .values(letterAttachments)
            .execute();
    }
    _getRepository(type, entityManager) {
        if (type === 'letter')
            return entityManager
                ? entityManager.getRepository(letter_1.LetterEntity)
                : this.letter;
        if (type === 'letterAttachment')
            return entityManager
                ? entityManager.getRepository(letter_attachment_1.LetterAttachmentEntity)
                : this.letterAttachment;
    }
};
exports.LetterRepository = LetterRepository;
exports.LetterRepository = LetterRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(letter_1.LetterEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(letter_attachment_1.LetterAttachmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LetterRepository);
//# sourceMappingURL=letter.js.map