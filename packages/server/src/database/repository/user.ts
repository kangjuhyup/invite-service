import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  InsertUser,
  SelectUser,
  UpdateUser,
  UpsertUserProfileImage,
} from './param/user';
import { YN } from '@app/util/yn';
import { UserEntity } from '../entity/user';
import { UserAttachmentEntity } from '../entity/user.attachment';
import { AttachmentEntity } from '../entity/attachment';
import { UserColumn } from '../column/user.column';
import { UserAttachmentColumn } from '../column/user.attachment.column';
import { AttachmentColumn } from '../column/attachment.column';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly user: Repository<UserEntity>,
    @InjectRepository(UserAttachmentEntity)
    private readonly userAttachment: Repository<UserAttachmentEntity>,
    @InjectRepository(AttachmentEntity)
    private readonly attachment: Repository<AttachmentEntity>,
  ) {}

  async selectUserFromEmail({
    email,
    entityManager,
  }: Pick<SelectUser, 'email' | 'entityManager'>) {
    const repo = this._getRepository('user', entityManager);
    return await repo.findOne({
      where: {
        email,
        useYn: YN.Y,
      },
      relations : {
        userAttachment: {
          attachment: true
        }
      }
    });
  }

  async selectUserFromId({
    userId,
    entityManager,
  }: Pick<SelectUser, 'userId' | 'entityManager'>) {
    const repo = this._getRepository('user', entityManager);
    return await repo.findOne({
      where: {
        userId,
        useYn: YN.Y,
      },
      relations: {
        userAttachment: {
          attachment: true,
        },
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
  }: Pick<
    UpdateUser,
    'userId' | 'refreshToken' | 'updator' | 'entityManager'
  >) {
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

  async updateUserProfile({
    userId,
    nickName,
    introduce,
    entityManager,
  }: Pick<UpdateUser, 'userId' | 'nickName' | 'introduce' | 'entityManager'>) {
    const repo = this._getRepository('user', entityManager);
    const set = {};
    if (nickName) set['nickName'] = nickName;
    if (introduce) set['introduce'] = introduce;
    return await repo.update(
      {
        userId,
      },
      set,
    );
  }

  async upsertUserProfileImage({
    userAttachment,
    entityManager,
  }: UpsertUserProfileImage) {
    const repo = this._getRepository('userAttachment', entityManager);
    return await repo
      .createQueryBuilder()
      .insert()
      .values(userAttachment)
      .orUpdate([UserColumn.userId, UserAttachmentColumn.attachmentCode, AttachmentColumn.attachmentId])
      .execute();
  }

  private _getRepository<T extends 'user' | 'userAttachment' | 'attachment'>(
    type: T,
    entityManager?: EntityManager,
  ): T extends 'user'
    ? Repository<UserEntity>
    : T extends 'userAttachment'
      ? Repository<UserAttachmentEntity>
      : Repository<AttachmentEntity> {
    if (type === 'user')
      return entityManager
        ? entityManager.getRepository(UserEntity)
        : (this.user as any);
    if (type === 'userAttachment')
      return entityManager
        ? entityManager.getRepository(UserAttachmentEntity)
        : (this.userAttachment as any);
    if (type === 'attachment')
      return entityManager
        ? entityManager.getRepository(AttachmentEntity)
        : (this.attachment as any);
  }
}
