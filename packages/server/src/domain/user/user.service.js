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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../../database/repository/user");
const common_1 = require("@nestjs/common");
const random_1 = require("../../util/random");
let UserService = UserService_1 = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUser(param) {
        const { phone, userId } = param;
        const user = phone
            ? await this.userRepository.selectUserFromPhone({ phone })
            : userId
                ? await this.userRepository.selectUserFromId({ userId })
                : undefined;
        if (!user)
            throw new common_1.UnauthorizedException('존재하지 않는 회원입니다.');
        return user;
    }
    async saveUser(phone, pwd) {
        await this.userRepository.insertUser({
            user: { nickName: (0, random_1.randomString)(), phone, password: pwd },
            creator: UserService_1.name,
        });
        return await this.getUser({ phone });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map