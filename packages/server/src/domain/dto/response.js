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
exports.HttpResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class ErrorResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '에러 코드',
        example: 'ERR_001',
    }),
    __metadata("design:type", String)
], ErrorResponse.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '에러 메시지',
        example: '잘못된 요청입니다.',
    }),
    __metadata("design:type", String)
], ErrorResponse.prototype, "message", void 0);
class HttpResponse {
}
exports.HttpResponse = HttpResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '응답 결과',
        example: true,
    }),
    __metadata("design:type", Boolean)
], HttpResponse.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '성공 시 반환되는 데이터',
        required: false,
    }),
    __metadata("design:type", Object)
], HttpResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '오류 발생 시 반환되는 에러 정보',
        required: false,
        type: ErrorResponse,
    }),
    __metadata("design:type", ErrorResponse)
], HttpResponse.prototype, "error", void 0);
//# sourceMappingURL=response.js.map