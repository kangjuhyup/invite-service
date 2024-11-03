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
exports.LetterCommentEntity = void 0;
const typeorm_1 = require("typeorm");
const letter_1 = require("./letter");
const letter_comment_column_1 = require("../column/letter.comment.column");
const letter_column_1 = require("../column/letter.column");
let LetterCommentEntity = class LetterCommentEntity {
};
exports.LetterCommentEntity = LetterCommentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: letter_comment_column_1.LetterCommentColumn.commentId, type: 'int' }),
    __metadata("design:type", Number)
], LetterCommentEntity.prototype, "letterCommentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: letter_column_1.LetterColumn.letterId, type: 'int', nullable: false }),
    __metadata("design:type", Number)
], LetterCommentEntity.prototype, "letterId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_comment_column_1.LetterCommentColumn.editor,
        type: 'varchar',
        length: 20,
        nullable: false,
    }),
    __metadata("design:type", String)
], LetterCommentEntity.prototype, "editor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_comment_column_1.LetterCommentColumn.body,
        type: 'varchar',
        length: 255,
        nullable: false,
    }),
    __metadata("design:type", String)
], LetterCommentEntity.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => letter_1.LetterEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: letter_column_1.LetterColumn.letterId }),
    __metadata("design:type", letter_1.LetterEntity)
], LetterCommentEntity.prototype, "letter", void 0);
exports.LetterCommentEntity = LetterCommentEntity = __decorate([
    (0, typeorm_1.Entity)({ name: letter_comment_column_1.LetterCommentColumn.table })
], LetterCommentEntity);
//# sourceMappingURL=letter.comment.js.map