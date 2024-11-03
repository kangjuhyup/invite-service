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
exports.LetterEntity = void 0;
const typeorm_1 = require("typeorm");
const default_1 = require("./default");
const category_1 = require("../../util/category");
const yn_1 = require("../../util/yn");
const user_1 = require("./user");
const letter_cateogry_1 = require("./letter.cateogry");
const letter_comment_1 = require("./letter.comment");
const letter_attachment_1 = require("./letter.attachment");
const letter_total_1 = require("./letter.total");
const letter_column_1 = require("../column/letter.column");
const user_column_1 = require("../column/user.column");
const letter_category_column_1 = require("../column/letter.category.column");
let LetterEntity = class LetterEntity extends default_1.DefaultEntity {
};
exports.LetterEntity = LetterEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', {
        name: letter_column_1.LetterColumn.letterId,
        type: 'int',
    }),
    __metadata("design:type", Number)
], LetterEntity.prototype, "letterId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: user_column_1.UserColumn.userId,
        type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
        nullable: false,
    }),
    __metadata("design:type", String)
], LetterEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_category_column_1.LetterCategoryColumn.letterCategoryCode,
        type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
        length: 5,
        nullable: false,
    }),
    __metadata("design:type", String)
], LetterEntity.prototype, "letterCategoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_column_1.LetterColumn.title,
        type: 'varchar',
        length: 20,
        nullable: false,
    }),
    __metadata("design:type", String)
], LetterEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_column_1.LetterColumn.body,
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", String)
], LetterEntity.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_column_1.LetterColumn.commentYn,
        type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
        length: 1,
        nullable: false,
        default: yn_1.YN.N,
    }),
    __metadata("design:type", String)
], LetterEntity.prototype, "commentYn", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_column_1.LetterColumn.attendYn,
        type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
        length: 1,
        nullable: false,
        default: yn_1.YN.N,
    }),
    __metadata("design:type", String)
], LetterEntity.prototype, "attendYn", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.UserEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: user_column_1.UserColumn.userId }),
    __metadata("design:type", user_1.UserEntity)
], LetterEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => letter_cateogry_1.LetterCategoryEntity, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: letter_category_column_1.LetterCategoryColumn.letterCategoryCode }),
    __metadata("design:type", letter_cateogry_1.LetterCategoryEntity)
], LetterEntity.prototype, "letterCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => letter_comment_1.LetterCommentEntity, (letterComment) => letterComment.letter, { nullable: true }),
    __metadata("design:type", Array)
], LetterEntity.prototype, "letterComment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => letter_attachment_1.LetterAttachmentEntity, (letterAttachment) => letterAttachment.letter, { nullable: false }),
    __metadata("design:type", Array)
], LetterEntity.prototype, "letterAttachment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => letter_total_1.LetterTotalEntity, { nullable: false }),
    __metadata("design:type", letter_total_1.LetterTotalEntity)
], LetterEntity.prototype, "letterTotal", void 0);
exports.LetterEntity = LetterEntity = __decorate([
    (0, typeorm_1.Entity)({ name: letter_column_1.LetterColumn.table })
], LetterEntity);
//# sourceMappingURL=letter.js.map