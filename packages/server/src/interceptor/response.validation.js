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
exports.ResponseValidationInterceptor = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const operators_1 = require("rxjs/operators");
let ResponseValidationInterceptor = class ResponseValidationInterceptor {
    constructor(dto) {
        this.dto = dto;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.mergeMap)(async (response) => {
            if (response.data) {
                const object = (0, class_transformer_1.plainToInstance)(this.dto, response.data);
                const errors = await (0, class_validator_1.validate)(object);
                if (errors.length > 0) {
                    throw new common_1.InternalServerErrorException('Invalid response data', this.formatErrors(errors));
                }
            }
            return response;
        }));
    }
    formatErrors(errors) {
        console.error(JSON.stringify(errors));
        return JSON.stringify(errors.map((err) => Object.values(err.constraints || '').join(', ')));
    }
};
exports.ResponseValidationInterceptor = ResponseValidationInterceptor;
exports.ResponseValidationInterceptor = ResponseValidationInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], ResponseValidationInterceptor);
//# sourceMappingURL=response.validation.js.map