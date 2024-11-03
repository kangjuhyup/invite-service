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
exports.PrepareRequest = exports.MetaDetail = exports.MetaDefault = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class MetaDefault {
}
exports.MetaDefault = MetaDefault;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Width of the object',
        example: '1920',
        type: String,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], MetaDefault.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Height of the object',
        example: '1080',
        type: String,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], MetaDefault.prototype, "height", void 0);
class MetaDetail extends MetaDefault {
}
exports.MetaDetail = MetaDetail;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'X coordinate of the object',
        example: '100',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], MetaDetail.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Y coordinate of the object',
        example: '150',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], MetaDetail.prototype, "y", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Z coordinate of the object',
        example: '200',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], MetaDetail.prototype, "z", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rotation angle of the object',
        example: '45',
        required: false,
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], MetaDetail.prototype, "angle", void 0);
class PrepareRequest {
}
exports.PrepareRequest = PrepareRequest;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Thumbnail metadata', type: MetaDefault }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MetaDefault),
    __metadata("design:type", MetaDefault)
], PrepareRequest.prototype, "thumbnailMeta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Letter metadata', type: MetaDefault }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MetaDefault),
    __metadata("design:type", MetaDefault)
], PrepareRequest.prototype, "letterMeta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Background metadata', type: MetaDefault }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MetaDefault),
    __metadata("design:type", MetaDefault)
], PrepareRequest.prototype, "backgroundMeta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Component metadata', type: [MetaDetail] }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MetaDetail),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PrepareRequest.prototype, "componentMetas", void 0);
//# sourceMappingURL=prepare.js.map