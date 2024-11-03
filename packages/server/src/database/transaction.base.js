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
exports.BaseTransaction = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let BaseTransaction = class BaseTransaction {
    constructor(datasource) {
        this.datasource = datasource;
    }
    async createRunner() {
        return this.datasource.createQueryRunner();
    }
    async run(data) {
        const queryRunner = await this.createRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('REPEATABLE READ');
        try {
            const result = await this.execute(data, queryRunner.manager);
            await queryRunner.commitTransaction();
            return result;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async runWithinTransaction(data, manager) {
        return this.execute(data, manager);
    }
};
exports.BaseTransaction = BaseTransaction;
exports.BaseTransaction = BaseTransaction = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BaseTransaction);
//# sourceMappingURL=transaction.base.js.map