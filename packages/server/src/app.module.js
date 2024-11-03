"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.modules = exports.routers = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const letter_module_1 = require("./domain/letter/letter.module");
const config_1 = require("@nestjs/config");
const class_transformer_1 = require("class-transformer");
const env_1 = require("./domain/dto/env");
const class_validator_1 = require("class-validator");
const storage_module_1 = require("./storage/storage.module");
const database_module_1 = require("./database/database.module");
const redis_module_1 = require("./redis/redis.module");
const auth_module_1 = require("./domain/auth/auth.module");
const user_module_1 = require("./domain/user/user.module");
exports.routers = [
    auth_module_1.AuthModule.forRootAsync({
        imports: [config_1.ConfigModule],
        useFactory: (config) => ({
            secret: config.get('JWT_SECRET'),
            expiresIn: config.get('JWT_EXPIRES'),
        }),
        inject: [config_1.ConfigService],
    }),
    user_module_1.UserModule,
    letter_module_1.LetterModule,
];
exports.modules = [
    config_1.ConfigModule.forRoot({
        isGlobal: true,
        validate: (config) => {
            const validatedConfig = (0, class_transformer_1.plainToClass)(env_1.Enviroments, config, {
                enableImplicitConversion: true,
            });
            const errors = (0, class_validator_1.validateSync)(validatedConfig);
            if (errors.length > 0) {
                errors.map((err) => {
                    console.error(err);
                });
            }
            return validatedConfig;
        },
    }),
    storage_module_1.StorageModule,
    database_module_1.DatabaseModule,
    redis_module_1.RedisClientModule.forRootAsync({
        project: 'invite-service',
        isGlobal: true,
        imports: [config_1.ConfigModule],
        useFactory: (config) => {
            return {
                host: config.get('REDIS_HOST'),
                port: config.get('REDIS_PORT'),
                password: config.get('REDIS_PWD'),
            };
        },
        inject: [config_1.ConfigService],
    }),
].filter(Boolean);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [...exports.routers, ...exports.modules],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map