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
exports.GetLetterDetailResponse = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class Background {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '배경 이미지 경로',
        example: 'https://example.com/bg.png',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Background.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '배경 이미지 너비',
        example: 800,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Background.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '배경 이미지 높이',
        example: 1600,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Background.prototype, "height", void 0);
class Image {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지 경로',
        example: 'https://example.com/img.png',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Image.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지 너비',
        example: 100,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Image.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지 높이',
        example: 80,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Image.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지의 X 좌표',
        example: 200,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Image.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지의 Y 좌표',
        example: 800,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Image.prototype, "y", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지의 Z 레이어',
        example: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Image.prototype, "z", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '이미지의 기울기',
        example: 90,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Image.prototype, "ang", void 0);
class Text {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '텍스트 본문',
        example: 'MOCK',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Text.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '텍스트 크기',
        example: 18,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Text.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '텍스트의 X 좌표',
        example: 200,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Text.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '텍스트의 Y 좌표',
        example: 600,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Text.prototype, "y", void 0);
class GetLetterDetailResponse {
}
exports.GetLetterDetailResponse = GetLetterDetailResponse;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetLetterDetailResponse.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetLetterDetailResponse.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '배경 이미지 정보',
        type: Background,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Background),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Background)
], GetLetterDetailResponse.prototype, "background", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '이미지 정보 배열',
        type: [Image],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Image),
    __metadata("design:type", Array)
], GetLetterDetailResponse.prototype, "components", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '텍스트 정보 배열',
        type: [Text],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Text),
    __metadata("design:type", Array)
], GetLetterDetailResponse.prototype, "text", void 0);
//# sourceMappingURL=get.detail.js.map