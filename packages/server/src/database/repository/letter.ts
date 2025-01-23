import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  DeleteLetter,
  DeleteLetterAttachment,
  InsertComment,
  InsertLetter,
  InsertLetterAttachment,
  SelectComment,
  SelectLetter,
  UpdateLetter,
} from './param/letter';
import { LetterAttachmentCode } from '@app/util/attachment';
import { YN } from '@app/util/yn';
import { DefaultColumn } from '../column/default';
import { LetterAttachmentColumn } from '../column/letter.attachment.column';
import { LetterEntity } from '../entity/letter';
import { LetterAttachmentEntity } from '../entity/letter.attachment';
import { LetterCommentEntity } from '../entity/letter.comment';

@Injectable()
export class LetterRepository {
  constructor(
    @InjectRepository(LetterEntity)
    private readonly letter: Repository<LetterEntity>,
    @InjectRepository(LetterAttachmentEntity)
    private readonly letterAttachment: Repository<LetterAttachmentEntity>,
    @InjectRepository(LetterCommentEntity)
    private readonly letterComment: Repository<LetterCommentEntity>,
  ) {}

  async selectLetterFromUser({
    userId,
    limit,
    skip,
    entityManager,
  }: Pick<
    SelectLetter,
    'userId' | 'limit' | 'skip' | 'entityManager'
  >): Promise<[LetterEntity[], number]> {
    const repo = this._getRepository(
      'letter',
      entityManager,
    ) as Repository<LetterEntity>;
    return await repo
      .createQueryBuilder('letter')
      .leftJoinAndSelect(
        'letter.letterAttachment',
        'letterAttachment',
        `letterAttachment.${LetterAttachmentColumn.attachmentCode} = :code`,
        { code: LetterAttachmentCode.THUMBNAIL },
      )
      .leftJoinAndSelect(
        'letterAttachment.attachment',
        'attachment',
        `attachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .where({ userId, useYn: YN.Y })
      .orderBy('letter.createdAt', 'DESC')
      .limit(limit)
      .offset(skip)
      .getManyAndCount();
  }

  async selectLetterFromId({
    letterId,
    entityManager,
  }: Pick<SelectLetter, 'letterId' | 'entityManager'>): Promise<LetterEntity> {
    const repo = this._getRepository(
      'letter',
      entityManager,
    ) as Repository<LetterEntity>;
    const qb = repo
      .createQueryBuilder('letter')
      .innerJoinAndSelect(
        'letter.letterAttachment',
        'letterAttachment',
        `letterAttachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'letterAttachment.attachment',
        'attachment',
        `attachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'letter.user',
        'user',
        `user.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .where({ letterId, useYn: YN.Y });
    return await qb.getOne();
  }

  async insertLetter({ letter, entityManager }: InsertLetter) {
    const repo = this._getRepository('letter', entityManager);
    return await repo.insert(letter);
  }

  async deleteLetter({
    letterId,
    entityManager,
  }: Pick<DeleteLetter, 'letterId' | 'entityManager'>) {
    const repo = this._getRepository('letter', entityManager);
    return await repo.update(
      {
        letterId,
      },
      {
        useYn: YN.N,
      },
    );
  }

  async deleteLetterAttachments({
    letterId,
    entityManager,
  }: Pick<DeleteLetterAttachment, 'letterId' | 'entityManager'>) {
    const repo = this._getRepository('letterAttachment', entityManager);
    return await repo.update(
      {
        letterId,
      },
      {
        useYn: YN.N,
      },
    );
  }

  async insertLetterAttachment({
    letterAttachments,
    entityManager,
  }: InsertLetterAttachment) {
    const repo = this._getRepository('letterAttachment', entityManager);
    await repo
      .createQueryBuilder()
      .insert()
      .values(letterAttachments)
      .execute();
  }

  async insertComment({ comment, entityManager }: InsertComment) {
    const repo = this._getRepository('letterComment', entityManager);
    return await repo.insert(comment);
  }

  async selectComment({
    letterCommentId,
    entityManager,
  }: Omit<SelectComment, 'letterId'>) {
    const repo = this._getRepository('letterComment', entityManager);
    return await repo.findOne({
      where: {
        letterCommentId: letterCommentId,
      },
    });
  }

  async selectComments({
    letterId,
    entityManager,
  }: Omit<SelectComment, 'letterCommentId'>) {
    const repo = this._getRepository('letterComment', entityManager);
    return await repo.find({
      where: {
        letterId: letterId,
        useYn: YN.Y,
      },
    });
  }

  async updateLetterPassword({
    letterId,
    password,
    updator,
    entityManager,
  }: Omit<UpdateLetter, 'title' | 'body'>) {
    const repo = this._getRepository('letter', entityManager);
    return await repo.update(
      {
        letterId,
      },
      {
        publicYn: YN.N,
        updator,
        password,
      },
    );
  }

  async deleteComment({
    letterCommentId,
    entityManager,
  }: Omit<SelectComment, 'letterId'>) {
    const repo = this._getRepository('letterComment', entityManager);
    return await repo.update(
      {
        letterCommentId: letterCommentId,
      },
      {
        useYn: YN.N,
      },
    );
  }

  async deleteCommentFromLetter({
    letterId,
    entityManager,
  }: Omit<SelectComment, 'letterCommentId'>) {
    const repo = this._getRepository('letterComment', entityManager);
    return await repo.update(
      {
        letterId: letterId,
      },
      {
        useYn: YN.N,
      },
    );
  }

  private _getRepository<
    T extends 'letter' | 'letterAttachment' | 'letterComment',
  >(
    type: T,
    entityManager?: EntityManager,
  ): T extends 'letter'
    ? Repository<LetterEntity>
    : T extends 'letterAttachment'
      ? Repository<LetterAttachmentEntity>
      : Repository<LetterCommentEntity> {
    if (type === 'letter')
      return (
        entityManager ? entityManager.getRepository(LetterEntity) : this.letter
      ) as any;
    if (type === 'letterAttachment')
      return (
        entityManager
          ? entityManager.getRepository(LetterAttachmentEntity)
          : this.letterAttachment
      ) as any;
    if (type === 'letterComment')
      return (
        entityManager
          ? entityManager.getRepository(LetterCommentEntity)
          : this.letterComment
      ) as any;
    throw new Error('Invalid repository type');
  }
}
