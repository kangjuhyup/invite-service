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
exports.RedisClientService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisClientService = class RedisClientService {
    constructor(redisClient, project) {
        this.redisClient = redisClient;
        this.project = project;
    }
    async set(key, value, expireInSeconds) {
        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
        if (expireInSeconds) {
            await this.redisClient.set(key, serializedValue, 'EX', expireInSeconds);
        }
        else {
            await this.redisClient.set(key, serializedValue);
        }
    }
    async get(key) {
        const result = await this.redisClient.get(key);
        if (!result)
            return null;
        try {
            return JSON.parse(result);
        }
        catch (e) {
            return result;
        }
    }
    async delete(key) {
        return this.redisClient.del(key);
    }
    async has(key) {
        const result = await this.redisClient.exists(key);
        return result === 1;
    }
    generateKey(service, key) {
        return `${this.project}::${service}::${key}`;
    }
};
exports.RedisClientService = RedisClientService;
exports.RedisClientService = RedisClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ioredis_1.default, String])
], RedisClientService);
//# sourceMappingURL=redis.client.service.js.map