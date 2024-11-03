"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const letter_datasource_1 = require("./datasource/letter.datasource");
const env_1 = require("../domain/dto/env");
const class_transformer_1 = require("class-transformer");
const letter_1 = require("./repository/letter");
const user_1 = require("./repository/user");
const letter_2 = require("./entity/letter");
const user_2 = require("./entity/user");
const letter_attachment_1 = require("./entity/letter.attachment");
const attachment_1 = require("./entity/attachment");
const attachment_2 = require("./repository/attachment");
const repositories = [letter_1.LetterRepository, attachment_2.AttachmentRepository, user_1.UserRepository];
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (config) => {
                    const env = (0, class_transformer_1.plainToInstance)(env_1.Enviroments, process.env, {
                        enableImplicitConversion: true,
                    });
                    const ds = (0, letter_datasource_1.LetterDataSource)({
                        type: env.DB_TYPE,
                        host: env.DB_HOST,
                        port: env.DB_PORT,
                        database: env.DB_NAME,
                        username: env.DB_USER,
                        password: env.DB_PWD,
                        synchronize: false,
                    });
                    await ds.initialize();
                    return ds.options;
                },
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_2.UserEntity,
                letter_2.LetterEntity,
                letter_attachment_1.LetterAttachmentEntity,
                attachment_1.AttachmentEntity,
            ]),
        ],
        providers: [...repositories],
        exports: [...repositories],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map