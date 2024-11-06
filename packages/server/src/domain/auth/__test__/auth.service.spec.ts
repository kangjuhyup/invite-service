import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserService } from 'packages/server/src/domain/user/user.service';
import { UserEntity } from 'packages/server/src/database/entity/user';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(),
            saveUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('로그인 시 액세스 토큰 반환', async () => {
      const mockUser: UserEntity = {
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
      const mockUser: UserEntity = {
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

      await expect(
        authService.signIn('01012341234', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('회원가입 시  액세스토큰 반환', async () => {
      const mockUser: UserEntity = {
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
      expect(userService.saveUser).toHaveBeenCalledWith(
        '01012341234',
        'password123',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.userId });
    });
  });
});
