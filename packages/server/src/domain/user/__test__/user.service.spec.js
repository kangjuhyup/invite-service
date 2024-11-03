"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_1 = require("../../../database/repository/user");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user.service");
jest.mock('@util/random', () => ({
    randomString: jest.fn(() => 'randomNickName'),
}));
describe('UserService', () => {
    let userService;
    let userRepository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                user_service_1.UserService,
                {
                    provide: user_1.UserRepository,
                    useValue: {
                        selectUserFromPhone: jest.fn(),
                        insertUser: jest.fn(),
                    },
                },
            ],
        }).compile();
        userService = module.get(user_service_1.UserService);
        userRepository = module.get(user_1.UserRepository);
    });
    describe('유저 조회', () => {
        it('유저가 존재할 때 조회 성공', async () => {
            const mockUser = {
                nickName: 'John',
                phone: '01012341234',
                password: 'test',
                userId: 'abc',
                useYn: 'Y',
                creator: '',
                createdAt: new Date(),
                updator: '',
                updatedAt: new Date(),
            };
            jest
                .spyOn(userRepository, 'selectUserFromPhone')
                .mockResolvedValue(mockUser);
            const result = await userService.getUser({ phone: '01012341234' });
            expect(result).toEqual(mockUser);
            expect(userRepository.selectUserFromPhone).toHaveBeenCalledWith({
                phone: '01012341234',
            });
        });
        it('유저가 없을 경우 401 에러', async () => {
            jest
                .spyOn(userRepository, 'selectUserFromPhone')
                .mockResolvedValue(undefined);
            await expect(userService.getUser({ phone: '01012341234' })).rejects.toThrow(common_1.UnauthorizedException);
            expect(userRepository.selectUserFromPhone).toHaveBeenCalledWith({
                phone: '01012341234',
            });
        });
    });
    describe('유저 생성', () => {
        it('should save a new user and return it', async () => {
            const mockUser = {
                nickName: 'randomNickName',
                phone: '01012341234',
                password: 'password123',
                userId: 'abc',
                useYn: 'Y',
                creator: '',
                createdAt: undefined,
                updator: '',
                updatedAt: undefined,
            };
            jest.spyOn(userRepository, 'insertUser').mockResolvedValue(undefined);
            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
            const result = await userService.saveUser('01012341234', 'password123');
            expect(result).toEqual(mockUser);
            expect(userRepository.insertUser).toHaveBeenCalledWith({
                user: {
                    nickName: 'randomNickName',
                    phone: '01012341234',
                    password: 'password123',
                },
                creator: user_service_1.UserService.name,
            });
        });
    });
});
//# sourceMappingURL=user.service.spec.js.map