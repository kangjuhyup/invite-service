import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { InsertUser } from '../param/user';
import { UserRepository } from '../user';
import { AttachmentEntity } from '@app/database/entity/attachment';
import { LetterEntity } from '@app/database/entity/letter';
import { LetterAttachmentEntity } from '@app/database/entity/letter.attachment';
import { LetterCategoryEntity } from '@app/database/entity/letter.cateogry';
import { LetterCommentEntity } from '@app/database/entity/letter.comment';
import { LetterTotalEntity } from '@app/database/entity/letter.total';
import { UserEntity } from '@app/database/entity/user';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let module: TestingModule;

  beforeAll(async () => {
    const entities = [
      UserEntity,
      LetterEntity,
      LetterCategoryEntity,
      LetterCommentEntity,
      LetterTotalEntity,
      LetterAttachmentEntity,
      AttachmentEntity,
    ];
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities,
          synchronize: true,
        }),
        TypeOrmModule.forFeature(entities),
      ],
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('selectUserFromPhone', () => {
    it('should return a user by phone', async () => {
      const userData: InsertUser = {
        user: { nickName: 'John', phone: '01012341234', password: 'test123' },
        creator: 'test',
      };
      await userRepository.insertUser({ ...userData });

      const foundUser = await userRepository.selectUserFromPhone({
        phone: '01012341234',
      });
      expect(foundUser).toBeDefined();
      expect(foundUser.phone).toBe(userData.user.phone);
      expect(foundUser.nickName).toBe(userData.user.nickName);
    });

    it('should return undefined if user does not exist', async () => {
      const foundUser = await userRepository.selectUserFromPhone({
        phone: 'nonexistent',
      });
      expect(foundUser).toBeNull();
    });
  });

  describe('insertUser', () => {
    it('should insert a user and return the generated ID', async () => {
      const userData: InsertUser = {
        user: { nickName: 'Jane', phone: '01098765432', password: 'password' },
        creator: 'test',
      };

      const result = await userRepository.insertUser({
        ...userData,
      });
      expect(result).toBeDefined();
      expect(result.identifiers.length).toBeGreaterThan(0);
    });
  });
});
