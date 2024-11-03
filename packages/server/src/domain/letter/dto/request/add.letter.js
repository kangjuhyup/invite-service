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
exports.AddLetterRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
const category_1 = require("../../../../util/category");
const class_validator_1 = require("class-validator");
class AddLetterRequest {
}
exports.AddLetterRequest = AddLetterRequest;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category of the letter',
        enum: category_1.LetterCategoryCode,
        example: category_1.LetterCategoryCode.ANNIVERSARY,
    }),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(Object.values(category_1.LetterCategoryCode)),
    __metadata("design:type", String)
], AddLetterRequest.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the letter',
        maxLength: 20,
        example: 'Sample Title',
    }),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], AddLetterRequest.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Body of the letter',
        maxLength: 255,
        example: 'This is a sample body text for the letter.',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AddLetterRequest.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if comments are allowed',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddLetterRequest.prototype, "commentYn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indicates if attendance is required',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddLetterRequest.prototype, "attendYn", void 0);
//# sourceMappingURL=add.letter.js.map