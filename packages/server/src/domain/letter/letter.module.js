"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterModule = void 0;
const common_1 = require("@nestjs/common");
const letter_controller_1 = require("./letter.controller");
const letter_service_1 = require("./service/letter.service");
const insert_letter_1 = require("./transaction/insert.letter");
const letter_attachment_service_1 = require("./service/letter.attachment.service");
const transactions = [insert_letter_1.InsertLetterTransaction];
let LetterModule = class LetterModule {
};
exports.LetterModule = LetterModule;
exports.LetterModule = LetterModule = __decorate([
    (0, common_1.Module)({
        controllers: [letter_controller_1.LetterController],
        providers: [letter_service_1.LetterService, letter_attachment_service_1.LetterAttachmentService, ...transactions],
    })
], LetterModule);
//# sourceMappingURL=letter.module.js.map