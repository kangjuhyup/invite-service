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
exports.LetterTotalEntity = void 0;
const typeorm_1 = require("typeorm");
const default_1 = require("./default");
const letter_1 = require("./letter");
const letter_total_column_1 = require("../column/letter.total.column");
const letter_column_1 = require("../column/letter.column");
let LetterTotalEntity = class LetterTotalEntity extends default_1.DefaultEntity {
};
exports.LetterTotalEntity = LetterTotalEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: letter_column_1.LetterColumn.letterId, type: 'int' }),
    __metadata("design:type", Number)
], LetterTotalEntity.prototype, "letterId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: letter_total_column_1.LetterTotalColumn.attendantcount, type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LetterTotalEntity.prototype, "attendantCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: letter_total_column_1.LetterTotalColumn.viewCount, type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LetterTotalEntity.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: letter_total_column_1.LetterTotalColumn.commentCount, type: 'int', default: 0 }),
    __metadata("design:type", Number)
], LetterTotalEntity.prototype, "commentCount", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => letter_1.LetterEntity, { nullable: false }),
    __metadata("design:type", letter_1.LetterEntity)
], LetterTotalEntity.prototype, "letter", void 0);
exports.LetterTotalEntity = LetterTotalEntity = __decorate([
    (0, typeorm_1.Entity)({ name: letter_total_column_1.LetterTotalColumn.table })
], LetterTotalEntity);
//# sourceMappingURL=letter.total.js.map