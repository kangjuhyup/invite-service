"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
const user_service_1 = require("../../user/user.service");
describe('AuthService', () => {
    let authService;
    let userService;
    let jwtService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: user_service_1.UserService,
                    useValue: {
                        getUser: jest.fn(),
                        saveUser: jest.fn(),
                    },
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
        userService = module.get(user_service_1.UserService);
        jwtService = module.get(jwt_1.JwtService);
    });
    describe('signIn', () => {
        it('로그인 시 액세스 토큰 반환', async () => {
            const mockUser = {
                userId: 'user-1',
                nickName: 'test',
                phone: '01012341234',
                password: 'password123',
                useYn: 'Y',
                creator: '',
                createdAt: new Date(),
                updator: '',
                updatedAt: new Date(),
            };
            const mockToken = 'mockAccessToken';
            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
            jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);
            const result = await authService.signIn('01012341234', 'password123');
            expect(result).toEqual({ access: mockToken });
            expect(userService.getUser).toHaveBeenCalledWith({
                phone: '01012341234',
            });
            expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.userId });
        });
        it('패스워드 틀렸을 경우 401에러 발생', async () => {
            const mockUser = {
                userId: 'user-1',
                nickName: 'test',
                phone: '01012341234',
                password: 'password123',
                useYn: 'Y',
                creator: '',
                createdAt: new Date(),
                updator: '',
                updatedAt: new Date(),
            };
            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
            await expect(authService.signIn('01012341234', 'wrongpassword')).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('signUp', () => {
        it('회원가입 시  액세스토큰 반환', async () => {
            const mockUser = {
                userId: 'user-1',
                nickName: 'test',
                phone: '01012341234',
                password: 'password123',
                createdAt: new Date(),
                updatedAt: new Date(),
                useYn: 'Y',
                creator: '',
                updator: '',
            };
            const mockToken = 'mockAccessToken';
            jest.spyOn(userService, 'saveUser').mockResolvedValue(mockUser);
            jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);
            const result = await authService.signUp('01012341234', 'password123');
            expect(result).toEqual({ access: mockToken });
            expect(userService.saveUser).toHaveBeenCalledWith('01012341234', 'password123');
            expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.userId });
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map