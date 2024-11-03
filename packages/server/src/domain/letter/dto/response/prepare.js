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
exports.PrepareResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PrepareResponse {
}
exports.PrepareResponse = PrepareResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '썸네일 업로드 권한이 열려있는 url',
        example: 'https://s3.ap-northeast-1.wasabisys.com/bucket/file.txt?AWSAccessKeyId=...',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], PrepareResponse.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '초대장 업로드 권한이 열려있는 url',
        example: 'https://s3.ap-northeast-1.wasabisys.com/bucket/file.txt?AWSAccessKeyId=...',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], PrepareResponse.prototype, "letterUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '배경 업로드 권한이 열려있는 url',
        example: 'https://s3.ap-northeast-1.wasabisys.com/bucket/file.txt?AWSAccessKeyId=...',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], PrepareResponse.prototype, "backgroundUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '아이템 업로드 권한이 열려있는 url',
        example: '[https://s3.ap-northeast-1.wasabisys.com/bucket/file.txt?AWSAccessKeyId=...]',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    __metadata("design:type", Array)
], PrepareResponse.prototype, "componentUrls", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'url 만료 기간',
        example: 60,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PrepareResponse.prototype, "expires", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '세션키',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrepareResponse.prototype, "sessionKey", void 0);
//# sourceMappingURL=prepare.js.map