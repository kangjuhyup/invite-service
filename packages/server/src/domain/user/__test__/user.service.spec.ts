import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserEntity } from '@app/database/entity/user';
import { UserRepository } from '@app/database/repository/user';

jest.mock('@util/random', () => ({
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
            selectUserFromPhone: jest.fn(),
            insertUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('유저 조회', () => {
    it('유저가 존재할 때 조회 성공', async () => {
      const mockUser: UserEntity = {
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

      await expect(
        userService.getUser({ phone: '01012341234' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.selectUserFromPhone).toHaveBeenCalledWith({
        phone: '01012341234',
      });
    });
  });

  describe('유저 생성', () => {
    it('should save a new user and return it', async () => {
      const mockUser: UserEntity = {
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
        creator: UserService.name,
      });
    });
  });
});
