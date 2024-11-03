"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RedisClientModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClientModule = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_client_service_1 = require("./redis.client.service");
const REDIS_CLIENT = 'REDIS_CLIENT';
let RedisClientModule = RedisClientModule_1 = class RedisClientModule {
    static forRootAsync(options) {
        const redisProvider = {
            provide: REDIS_CLIENT,
            useFactory: async (...args) => {
                const redisOptions = await options.useFactory(...args);
                return new ioredis_1.default(redisOptions);
            },
            inject: options.inject || [],
        };
        return {
            module: RedisClientModule_1,
            imports: options.imports || [],
            providers: [
                redisProvider,
                {
                    provide: redis_client_service_1.RedisClientService,
                    useFactory: (redis) => new redis_client_service_1.RedisClientService(redis, options.project),
                    inject: [REDIS_CLIENT],
                },
            ],
            exports: [redis_client_service_1.RedisClientService],
            global: options.isGlobal || false,
        };
    }
};
exports.RedisClientModule = RedisClientModule;
exports.RedisClientModule = RedisClientModule = RedisClientModule_1 = __decorate([
    (0, common_1.Module)({})
], RedisClientModule);
//# sourceMappingURL=redis.module.js.map