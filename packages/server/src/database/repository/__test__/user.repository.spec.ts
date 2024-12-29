import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../user';
import { UserEntity } from '../../entity/user';
import { YN } from '@app/util/yn';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockRepository: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('이메일로 사용자 조회 테스트', () => {
    const mockUser: UserEntity = {
      userId: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedPassword',
      nickName: 'TestUser',
      refreshToken: 'test-refresh-token',
      useYn: YN.Y,
      creator: 'system',
      createdAt: new Date(),
      updator: 'system',
      updatedAt: new Date(),
    };

    it('이메일로 사용자를 성공적으로 조회해야 함', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.selectUserFromEmail({
        email: 'test@example.com',
      });

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          email: 'test@example.com',
          useYn: YN.Y,
        },
      });
    });

    it('존재하지 않는 이메일로 조회 시 undefined를 반환해야 함', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await userRepository.selectUserFromEmail({
        email: 'nonexistent@example.com',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('사용자 ID로 사용자 조회 테스트', () => {
    const mockUser: UserEntity = {
      userId: 'test-user-id',
      email: 'test@example.com',
      password: 'hashedPassword',
      nickName: 'TestUser',
      refreshToken: 'test-refresh-token',
      useYn: YN.Y,
      creator: 'system',
      createdAt: new Date(),
      updator: 'system',
      updatedAt: new Date(),
    };

    it('사용자 ID로 사용자를 성공적으로 조회해야 함', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.selectUserFromId({
        userId: 'test-user-id',
      });

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          userId: 'test-user-id',
          useYn: YN.Y,
        },
      });
    });

    it('존재하지 않는 사용자 ID로 조회 시 undefined를 반환해야 함', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await userRepository.selectUserFromId({
        userId: 'nonexistent-id',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('사용자 생성 테스트', () => {
    const newUser = {
      email: 'new@example.com',
      password: 'newPassword',
      nickName: 'NewUser',
    };

    it('새로운 사용자를 성공적으로 생성해야 함', async () => {
      mockRepository.insert.mockResolvedValue(undefined);

      await userRepository.insertUser({
        user: newUser,
        creator: 'system',
      });

      expect(mockRepository.insert).toHaveBeenCalledWith({
        ...newUser,
        creator: 'system',
        updator: 'system',
      });
    });
  });

  describe('리프레시 토큰 업데이트 테스트', () => {
    it('리프레시 토큰을 성공적으로 업데이트해야 함', async () => {
      mockRepository.update.mockResolvedValue(undefined);

      await userRepository.updateUser({
        userId: 'test-user-id',
        refreshToken: 'new-refresh-token',
        updator: 'system',
      });

      expect(mockRepository.update).toHaveBeenCalledWith(
        {
          refreshToken: 'new-refresh-token',
          updator: 'system',
        },
        {
          userId: 'test-user-id',
        },
      );
    });
  });
});