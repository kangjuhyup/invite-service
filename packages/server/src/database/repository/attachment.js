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
exports.AttachmentRepository = void 0;
const attachment_1 = require("../entity/attachment");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let AttachmentRepository = class AttachmentRepository {
    constructor(attachment) {
        this.attachment = attachment;
    }
    async selectAttachments({ attachmentPaths, entityManager, }) {
        const repo = this._getRepository('attachment', entityManager);
        return await repo
            .createQueryBuilder()
            .select()
            .where({
            attachmentPath: (0, typeorm_2.In)(attachmentPaths),
        })
            .getMany();
    }
    async insertAttachment({ attachment, entityManager, }) {
        const repo = this._getRepository('attachment', entityManager);
        return await repo.insert(attachment);
    }
    async bulkInsertAttachments({ attachments, entityManager, }) {
        const repo = this._getRepository('attachment', entityManager);
        return await repo
            .createQueryBuilder()
            .insert()
            .values(attachments)
            .execute();
    }
    _getRepository(type, entityManager) {
        if (type === 'attachment')
            return entityManager
                ? entityManager.getRepository(attachment_1.AttachmentEntity)
                : this.attachment;
    }
};
exports.AttachmentRepository = AttachmentRepository;
exports.AttachmentRepository = AttachmentRepository = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(attachment_1.AttachmentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttachmentRepository);
//# sourceMappingURL=attachment.js.map