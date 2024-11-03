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
exports.LetterCategoryEntity = void 0;
const category_1 = require("../../util/category");
const typeorm_1 = require("typeorm");
const default_1 = require("./default");
const letter_1 = require("./letter");
const letter_category_column_1 = require("../column/letter.category.column");
let LetterCategoryEntity = class LetterCategoryEntity extends default_1.DefaultEntity {
};
exports.LetterCategoryEntity = LetterCategoryEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: letter_category_column_1.LetterCategoryColumn.letterCategoryCode,
        type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
        length: 5,
    }),
    __metadata("design:type", String)
], LetterCategoryEntity.prototype, "letterCategoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: letter_category_column_1.LetterCategoryColumn.letterCategoryDetail,
        type: 'varchar',
        length: 20,
    }),
    __metadata("design:type", String)
], LetterCategoryEntity.prototype, "letterCategoryDetail", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => letter_1.LetterEntity, (letter) => letter.letterCategory, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], LetterCategoryEntity.prototype, "letter", void 0);
exports.LetterCategoryEntity = LetterCategoryEntity = __decorate([
    (0, typeorm_1.Entity)({ name: letter_category_column_1.LetterCategoryColumn.table })
], LetterCategoryEntity);
//# sourceMappingURL=letter.cateogry.js.map