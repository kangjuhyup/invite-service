import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { InsertUser, SelectUser, UpdateUser } from './param/user';
import { YN } from '@app/util/yn';
import { UserEntity } from '../entity/user';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly user: Repository<UserEntity>,
  ) {}

  async selectUserFromId({ userId, entityManager }: Omit<SelectUser, 'phone'>) {
    const repo = this._getRepository('user', entityManager);
    return await repo.findOne({
      where: {
        userId,
        useYn: YN.Y,
      },
    });
  }
  async selectUserFromPhone({
    phone,
    entityManager,
  }: Omit<SelectUser, 'userId'>) {
    const repo = this._getRepository('user', entityManager);
    return await repo.findOne({
      where: {
        phone,
        useYn: YN.Y,
      },
    });
  }

  async insertUser({ user, creator, entityManager }: InsertUser) {
    const repo = this._getRepository('user', entityManager);
    return await repo.insert({
      ...user,
      creator,
      updator: creator,
    });
  }

  async updateUser({
    userId,
    refreshToken,
    updator,
    entityManager,
  }: UpdateUser) {
    const repo = this._getRepository('user', entityManager);
    const set = {};
    if (refreshToken) set['refreshToken'] = refreshToken;
    return await repo.update(
      {
        ...set,
        updator,
      },
      {
        userId,
      },
    );
  }

  private _getRepository(type: 'user', entityManager?: EntityManager) {
    if (type === 'user')
      return entityManager
        ? entityManager.getRepository(UserEntity)
        : this.user;
  }
}
