import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserEntity } from '@app/database/entity/user';
import { UserService } from '@app/domain/user/user.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                JWT_SECRET: 'test-secret',
                JWT_REFRESH_EXPIRES: '7d',
                JWT_ACCESS_EXPIRES: '1h',
              };
              return config[key];
            }),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn(),
            saveUser: jest.fn(),
            updateRefresh: jest.fn(),
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
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('로그인', () => {
    const mockUser: UserEntity = {
      userId: 'test-user-id',
      email: 'test@example.com',
      password: 'password123',
      nickName: 'TestUser',
      refreshToken: 'old-refresh-token',
      useYn: 'Y',
      creator: 'system',
      createdAt: new Date(),
      updator: 'system',
      updatedAt: new Date(),
    };

    it('이메일과 비밀번호가 일치할 경우 토큰을 반환해야 함', async () => {
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';

      jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign')
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);
      jest.spyOn(userService, 'updateRefresh').mockResolvedValue(undefined);

      const result = await authService.signIn('test@example.com', 'password123');

      expect(result).toEqual({
        userId: mockUser.userId,
        access: mockAccessToken,
        refresh: mockRefreshToken,
      });
      expect(userService.updateRefresh).toHaveBeenCalledWith(
        mockUser.userId,
        mockRefreshToken,
      );
    });

    it('비밀번호가 일치하지 않을 경우 예외가 발생해야 함', async () => {
      jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);

      await expect(
        authService.signIn('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('회원가입', () => {
    const mockUser: UserEntity = {
      userId: 'test-user-id',
      email: 'test@example.com',
      password: 'password123',
      nickName: 'TestUser',
      useYn: 'Y',
      creator: 'system',
      createdAt: new Date(),
      updator: 'system',
      updatedAt: new Date(),
    };

    it('새로운 사용자 등록 후 토큰을 반환해야 함', async () => {
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';

      jest.spyOn(userService, 'saveUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign')
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);
      jest.spyOn(userService, 'updateRefresh').mockResolvedValue(undefined);

      const result = await authService.signUp('test@example.com', 'password123');

      expect(result).toEqual({
        access: mockAccessToken,
        refresh: mockRefreshToken,
      });
      expect(userService.saveUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(userService.updateRefresh).toHaveBeenCalledWith(
        mockUser.userId,
        mockRefreshToken,
      );
    });
  });

  describe('토큰 재발급', () => {
    it('새로운 액세스 토큰과 리프레시 토큰을 발급해야 함', async () => {
      const userId = 'test-user-id';
      const mockAccessToken = 'new-access-token';
      const mockRefreshToken = 'new-refresh-token';

      jest.spyOn(jwtService, 'sign')
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);
      jest.spyOn(userService, 'updateRefresh').mockResolvedValue(undefined);

      const result = await authService.resign(userId);

      expect(result).toEqual({
        access: mockAccessToken,
        refresh: mockRefreshToken,
      });
      expect(userService.updateRefresh).toHaveBeenCalledWith(
        userId,
        mockRefreshToken,
      );
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});