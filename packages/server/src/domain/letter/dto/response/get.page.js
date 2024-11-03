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
exports.GetLetterPageResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const category_1 = require("../../../../util/category");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class LetterPageItem {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '초대장 ID',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LetterPageItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '초대장 제목',
        example: '생일파티 초대',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LetterPageItem.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '카테고리',
        example: category_1.LetterCategoryCode.ANNIVERSARY,
        enum: Object.values(category_1.LetterCategoryCode),
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(Object.values(category_1.LetterCategoryCode)),
    __metadata("design:type", String)
], LetterPageItem.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '썸네일 이미지 경로',
        example: 'https://s3.ap-northeast-1.wasabisys.com/thm/00001',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LetterPageItem.prototype, "thumbnail", void 0);
class GetLetterPageResponse {
}
exports.GetLetterPageResponse = GetLetterPageResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '초대장 총 개수',
        example: 10,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetLetterPageResponse.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '초대장 정보 목록',
        type: [LetterPageItem],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => LetterPageItem),
    __metadata("design:type", Array)
], GetLetterPageResponse.prototype, "items", void 0);
//# sourceMappingURL=get.page.js.map