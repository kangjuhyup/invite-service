"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterBaseService = void 0;
const env_1 = require("../../dto/env");
const class_transformer_1 = require("class-transformer");
class LetterBaseService {
    get thumbnailBucket() {
        return this._thumbnailBucket;
    }
    get backGroundBucket() {
        return this._backGroundBucket;
    }
    get componentBucket() {
        return this._componentBucket;
    }
    get letterBucket() {
        return this._letterBucket;
    }
    get urlExpires() {
        return this._urlExpires;
    }
    constructor() {
        this._urlExpires = 600;
        {
            const env = (0, class_transformer_1.plainToInstance)(env_1.Enviroments, process.env, {
                enableImplicitConversion: true,
            });
            this._thumbnailBucket = env.THUMB_BUCKET;
            this._backGroundBucket = env.BACKGROUND_BUCKET;
            this._componentBucket = env.COMPONENT_BUCKET;
            this._letterBucket = env.LETTER_BUCKET;
        }
    }
}
exports.LetterBaseService = LetterBaseService;
//# sourceMappingURL=letter.base.service.js.map