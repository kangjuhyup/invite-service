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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_page_1 = require("./dto/request/get.page");
const get_page_2 = require("./dto/response/get.page");
const letter_service_1 = require("./service/letter.service");
const prepare_1 = require("./dto/response/prepare");
const prepare_2 = require("./dto/request/prepare");
const add_letter_1 = require("./dto/request/add.letter");
const add_letter_2 = require("./dto/response/add.letter");
const response_validation_1 = require("../../interceptor/response.validation");
const user_guard_1 = require("../../jwt/guard/user.guard");
const get_detail_1 = require("./dto/request/get.detail");
const get_detail_2 = require("./dto/response/get.detail");
let LetterController = class LetterController {
    constructor(letterService) {
        this.letterService = letterService;
    }
    async getLetters(dto, req) {
        return {
            result: true,
            data: await this.letterService.getLetters(dto, req.user),
        };
    }
    async prepareAddLetter(dto, req) {
        return {
            result: true,
            data: await this.letterService.prepareAddLetter(dto, req.user),
        };
    }
    async addLetter(dto, req) {
        return {
            result: true,
            data: await this.letterService.addLetter(dto, req.user),
        };
    }
    async getLetterDetail(dto) {
        return {
            result: true,
            data: await this.letterService.getLetterDetail(dto.id),
        };
    }
};
exports.LetterController = LetterController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '내 초대장 페이지 조회' }),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: '성공',
        type: get_page_2.GetLetterPageResponse,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.UseInterceptors)(new response_validation_1.ResponseValidationInterceptor(get_page_2.GetLetterPageResponse)),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_page_1.GetLetterPageRequest, Object]),
    __metadata("design:returntype", Promise)
], LetterController.prototype, "getLetters", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '초대장 업로드 url 조회',
        description: '반환된 URL을 통해 업로드할 때 헤더를 첨부해야 한다.\n필수:[x-amx-session:세션키,x-amx-width:파일의 가로크기,x-amx-height:파일의 세로크기]\n선택(Component 업로드 시):[x-amx-x:파일의 x 좌표,x-amx-y:파일의 y 좌표,x-amx-z:파일의 인덱스,x-amx-angle:파일의 기울기]',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: '성공',
        type: prepare_1.PrepareResponse,
    }),
    (0, common_1.Post)('prepare-add'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.UseInterceptors)(new response_validation_1.ResponseValidationInterceptor(prepare_1.PrepareResponse)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prepare_2.PrepareRequest, Object]),
    __metadata("design:returntype", Promise)
], LetterController.prototype, "prepareAddLetter", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '초대장 업로드' }),
    (0, swagger_1.ApiOkResponse)({
        status: 201,
        description: '성공',
        type: add_letter_2.AddLetterResponse,
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.UseInterceptors)(new response_validation_1.ResponseValidationInterceptor(add_letter_2.AddLetterResponse)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_letter_1.AddLetterRequest, Object]),
    __metadata("design:returntype", Promise)
], LetterController.prototype, "addLetter", null);
__decorate([
    (0, common_1.Get)('share/:id'),
    (0, swagger_1.ApiOperation)({ summary: '공유된 초대장 페이지' }),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '초대장 상세 정보 조회' }),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: '성공',
        type: get_detail_2.GetLetterDetailResponse,
    }),
    (0, common_1.UseInterceptors)(new response_validation_1.ResponseValidationInterceptor(get_detail_2.GetLetterDetailResponse)),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_detail_1.GetLetterDetailRequest]),
    __metadata("design:returntype", Promise)
], LetterController.prototype, "getLetterDetail", null);
exports.LetterController = LetterController = __decorate([
    (0, common_1.Controller)('letter'),
    __metadata("design:paramtypes", [letter_service_1.LetterService])
], LetterController);
//# sourceMappingURL=letter.controller.js.map