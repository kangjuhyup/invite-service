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
exports.LetterAttachmentEntity = void 0;
const typeorm_1 = require("typeorm");
const default_1 = require("./default");
const letter_1 = require("./letter");
const attachment_1 = require("./attachment");
const letter_attachment_column_1 = require("../column/letter.attachment.column");
const letter_column_1 = require("../column/letter.column");
const attachment_column_1 = require("../column/attachment.column");
const attachment_2 = require("../../util/attachment");
let LetterAttachmentEntity = class LetterAttachmentEntity extends default_1.DefaultEntity {
};
exports.LetterAttachmentEntity = LetterAttachmentEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: letter_column_1.LetterColumn.letterId, type: 'int' }),
    __metadata("design:type", Number)
], LetterAttachmentEntity.prototype, "letterId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: letter_attachment_column_1.LetterAttachmentColumn.attachmentCode,
        type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
        length: 5,
    }),
    __metadata("design:type", String)
], LetterAttachmentEntity.prototype, "attachmentCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_attachment_column_1.LetterAttachmentColumn.angle,
        type: 'int',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], LetterAttachmentEntity.prototype, "angle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: letter_attachment_column_1.LetterAttachmentColumn.width, type: 'int', nullable: false }),
    __metadata("design:type", Number)
], LetterAttachmentEntity.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: letter_attachment_column_1.LetterAttachmentColumn.height, type: 'int', nullable: false }),
    __metadata("design:type", Number)
], LetterAttachmentEntity.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_attachment_column_1.LetterAttachmentColumn.x,
        type: 'int',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], LetterAttachmentEntity.prototype, "x", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_attachment_column_1.LetterAttachmentColumn.y,
        type: 'int',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], LetterAttachmentEntity.prototype, "y", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_attachment_column_1.LetterAttachmentColumn.z,
        type: 'int',
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], LetterAttachmentEntity.prototype, "z", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: attachment_column_1.AttachmentColumn.attachmentId, type: 'int' }),
    __metadata("design:type", Number)
], LetterAttachmentEntity.prototype, "attachmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => letter_1.LetterEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: letter_column_1.LetterColumn.letterId }),
    __metadata("design:type", letter_1.LetterEntity)
], LetterAttachmentEntity.prototype, "letter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attachment_1.AttachmentEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: attachment_column_1.AttachmentColumn.attachmentId }),
    __metadata("design:type", attachment_1.AttachmentEntity)
], LetterAttachmentEntity.prototype, "attachment", void 0);
exports.LetterAttachmentEntity = LetterAttachmentEntity = __decorate([
    (0, typeorm_1.Entity)({ name: letter_attachment_column_1.LetterAttachmentColumn.table })
], LetterAttachmentEntity);
//# sourceMappingURL=letter.attachment.js.map