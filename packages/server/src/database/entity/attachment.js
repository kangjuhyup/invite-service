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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentEntity = void 0;
const typeorm_1 = require("typeorm");
const default_1 = require("./default");
const letter_attachment_1 = require("./letter.attachment");
const attachment_column_1 = require("../column/attachment.column");
let AttachmentEntity = class AttachmentEntity extends default_1.DefaultEntity {
};
exports.AttachmentEntity = AttachmentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: attachment_column_1.AttachmentColumn.attachmentId }),
    __metadata("design:type", Number)
], AttachmentEntity.prototype, "attachmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: attachment_column_1.AttachmentColumn.attachmentPath,
        type: 'varchar',
        length: 255,
        nullable: false,
    }),
    __metadata("design:type", String)
], AttachmentEntity.prototype, "attachmentPath", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => letter_attachment_1.LetterAttachmentEntity, (letterAttachment) => letterAttachment.attachment, { nullable: true }),
    __metadata("design:type", Array)
], AttachmentEntity.prototype, "letterAttachment", void 0);
exports.AttachmentEntity = AttachmentEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: attachment_column_1.AttachmentColumn.table,
    })
], AttachmentEntity);
//# sourceMappingURL=attachment.js.map