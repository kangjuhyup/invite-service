import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserEntity } from '@app/database/entity/user';
import { UserRepository } from '@app/database/repository/user';

jest.mock('@app/util/random', () => ({
  randomString: jest.fn(() => 'randomNickName'),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            selectUserFromEmail: jest.fn(),
            selectUserFromId: jest.fn(),
            insertUser: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('사용자 조회 테스트', () => {
    const mockUser: UserEntity = {
      userId: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedPassword',
      nickName: 'TestUser',
      refreshToken: 'test-refresh-token',
      useYn: 'Y',
      creator: '',
      createdAt: new Date(),
      updator: '',
      updatedAt: new Date(),
    };

    it('이메일로 사용자를 성공적으로 조회해야 함', async () => {
      jest
        .spyOn(userRepository, 'selectUserFromEmail')
        .mockResolvedValue(mockUser);

      const result = await userService.getUser({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('사용자 ID로 사용자를 성공적으로 조회해야 함', async () => {
      jest
        .spyOn(userRepository, 'selectUserFromId')
        .mockResolvedValue(mockUser);

      const result = await userService.getUser({ userId: 'test-user-id' });
      expect(result).toEqual(mockUser);
    });

    it('존재하지 않는 사용자 조회 시 인증 예외가 발생해야 함', async () => {
      jest
        .spyOn(userRepository, 'selectUserFromEmail')
        .mockResolvedValue(undefined);

      await expect(
        userService.getUser({ email: 'nonexistent@example.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('리프레시 토큰 검증 테스트', () => {
    const mockUser: UserEntity = {
      userId: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedPassword',
      nickName: 'TestUser',
      refreshToken: 'valid-refresh-token',
      useYn: 'Y',
      creator: '',
      createdAt: new Date(),
      updator: '',
      updatedAt: new Date(),
    };

    it('유효한 리프레시 토큰으로 검증이 성공해야 함', async () => {
      jest.spyOn(userRepository, 'selectUserFromId').mockResolvedValue(mockUser);

      const result = await userService.validateRefresh(
        'test-user-id',
        'valid-refresh-token',
      );
      expect(result).toEqual(mockUser);
    });

    it('유효하지 않은 리프레시 토큰으로 검증 시 예외가 발생해야 함', async () => {
      jest.spyOn(userRepository, 'selectUserFromId').mockResolvedValue(mockUser);

      await expect(
        userService.validateRefresh('test-user-id', 'invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('사용자 저장 테스트', () => {
    const mockUser: UserEntity = {
      userId: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedPassword',
      nickName: 'randomNickName',
      useYn: 'Y',
      creator: UserService.name,
      createdAt: new Date(),
      updator: '',
      updatedAt: new Date(),
    };

    it('새로운 사용자가 성공적으로 저장되어야 함', async () => {
      jest.spyOn(userRepository, 'insertUser').mockResolvedValue(undefined);
      jest
        .spyOn(userRepository, 'selectUserFromEmail')
        .mockResolvedValue(mockUser);

      const result = await userService.saveUser('test@example.com', 'password123');
      
      expect(userRepository.insertUser).toHaveBeenCalledWith({
        user: {
          email: 'test@example.com',
          password: 'password123',
          nickName: 'randomNickName',
        },
        creator: UserService.name,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('리프레시 토큰 업데이트 테스트', () => {
    it('리프레시 토큰이 성공적으로 업데이트되어야 함', async () => {
      jest.spyOn(userRepository, 'updateUser').mockResolvedValue(undefined);

      await userService.updateRefresh('test-user-id', 'new-refresh-token');
      
      expect(userRepository.updateUser).toHaveBeenCalledWith({
        userId: 'test-user-id',
        refreshToken: 'new-refresh-token',
        updator: UserService.name,
      });
    });
  });
});