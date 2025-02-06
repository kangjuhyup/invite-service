import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  DeleteLetter,
  DeleteLetterAttachment,
  InsertComment,
  InsertLetter,
  InsertLetterAttachment,
  InsertLetterTotal,
  SelectComment,
  SelectLetter,
  UpdateLetter,
} from './param/letter';
import { LetterAttachmentCode } from '@app/util/attachment';
import { YN } from '@app/util/yn';
import { DefaultColumn } from '../column/default';
import { LetterAttachmentColumn } from '../column/letter.attachment.column';
import { LetterEntity } from '../entity/letter/letter';
import { LetterAttachmentEntity } from '../entity/letter/letter.attachment';
import { LetterCommentEntity } from '../entity/letter/letter.comment';
import { LetterTotalEntity } from '../entity/letter/letter.total';
import { LetterTotalColumn } from '../column/letter.total.column';

@Injectable()
export class LetterRepository {
  private readonly logger = new Logger(LetterRepository.name);
  constructor(
    @InjectRepository(LetterEntity)
    private readonly letter: Repository<LetterEntity>,
    @InjectRepository(LetterAttachmentEntity)
    private readonly letterAttachment: Repository<LetterAttachmentEntity>,
    @InjectRepository(LetterCommentEntity)
    private readonly letterComment: Repository<LetterCommentEntity>,
    @InjectRepository(LetterTotalEntity)
    private readonly letterTotal: Repository<LetterTotalEntity>,
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
        `letterAttachment.${LetterAttachmentColumn.attachmentCode} = :code AND letterAttachment.${DefaultColumn.useYn} = :useYn`,
        { code: LetterAttachmentCode.THUMBNAIL, useYn: YN.Y },
      )
      .leftJoinAndSelect(
        'letterAttachment.attachment',
        'attachment',
        `attachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .leftJoinAndSelect(
        'attachment.metadata',
        'metadata',
        `metadata.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'letter.letterTotal',
        'letterTotal',
      )
      .where({ userId, useYn: YN.Y })
      .orderBy('letter.createdAt', 'DESC')
      .limit(limit)
      .offset(skip)
      .getManyAndCount();
  }

  async selectLetterFromIdWithoutRelations({
    letterId,
    entityManager,
  }: Pick<SelectLetter, 'letterId' | 'entityManager'>): Promise<LetterEntity> {
    const repo = this._getRepository(
      'letter',
      entityManager,
    ) as Repository<LetterEntity>;
    return await repo.findOne({
      where: { letterId },
    });
  }

  async selectLetterCountFromUser({
    userId,
    entityManager,
  }: Pick<SelectLetter, 'userId' | 'entityManager'>): Promise<number> {
    const repo = this._getRepository(
      'letter',
      entityManager,
    ) as Repository<LetterEntity>;
    return await repo.count({
      where: { userId },
    });
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
      .leftJoinAndSelect(
        'letter.letterAttachment',
        'letterAttachment',
        `letterAttachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .leftJoinAndSelect(
        'letterAttachment.attachment',
        'attachment',
        `attachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'attachment.metadata',
        'metadata',
        `metadata.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'letter.user',
        'user',
        `user.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .where({ letterId, useYn: YN.Y });
    this.logger.debug(`qb : ${JSON.stringify(qb.getSql())}`);
    return await qb.getOne();
  }

  async insertLetter({ letter, entityManager }: InsertLetter) {
    const repo = this._getRepository('letter', entityManager);
    return await repo.insert(letter);
  }

  async insertLetterTotal({ letterTotal, entityManager }: InsertLetterTotal) {
    const repo = this._getRepository('letterTotal', entityManager);
    return await repo.insert(letterTotal);
  }

  async updateLetter({
    letterId,
    title,
    body,
    commentYn,
    attendYn,
    publicYn,
    updator,
    entityManager,
  }: Omit<UpdateLetter, 'password'>) {
    const repo = this._getRepository('letter', entityManager);
    const set = {
      updator,
    };
    if (title) set['title'] = title;
    if (body) set['body'] = body;
    if (commentYn) set['commentYn'] = commentYn;
    if (attendYn) set['attendYn'] = attendYn;
    if (publicYn) set['publicYn'] = publicYn;
    return await repo.update(
      {
        letterId,
      },
      {
        ...set,
      },
    );
  }

  async increaseLetterViewCount({
    letterId,
    entityManager,
  }: Pick<UpdateLetter, 'letterId' | 'entityManager'>) {
    const repo = this._getRepository('letterTotal', entityManager);
    return await repo.update(
      {
        letterId,
      },
      {
        viewCount: () => `${LetterTotalColumn.viewCount} + 1`,
      },
    );
  }

  async increaseLetterCommentCount({
    letterId,
    entityManager,
  }: Pick<UpdateLetter, 'letterId' | 'entityManager'>) {
    const repo = this._getRepository('letterTotal', entityManager);
    return await repo.update(
      {
        letterId,
      },
      {
        commentCount: () => `${LetterTotalColumn.commentCount} + 1`,
      },
    );
  }

  async decreaseLetterCommentCount({
    letterId,
    entityManager,
  }: Pick<UpdateLetter, 'letterId' | 'entityManager'>) {
    const repo = this._getRepository('letterTotal', entityManager);
    return await repo.update(
      {
        letterId,
      },
      {
        commentCount: () => `${LetterTotalColumn.commentCount} - 1`,
      },
    );
  }

  async increaseLetterAttendCount({
    letterId,
    entityManager,
  }: Pick<UpdateLetter, 'letterId' | 'entityManager'>) {
    const repo = this._getRepository('letterTotal', entityManager);
    return await repo.update(
      {
        letterId,
      },
      {
        attendantCount: () => `${LetterTotalColumn.attendantcount} + 1`,
      },
    );
  }

  async decreaseLetterAttendCount({
    letterId,
    entityManager,
  }: Pick<UpdateLetter, 'letterId' | 'entityManager'>) {
    const repo = this._getRepository('letterTotal', entityManager);
    return await repo.update(
      {
        letterId,
      },
      {
        attendantCount: () => `${LetterTotalColumn.attendantcount} - 1`,
      },
    );
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
    T extends 'letter' | 'letterAttachment' | 'letterComment' | 'letterTotal',
  >(
    type: T,
    entityManager?: EntityManager,
  ): T extends 'letter'
    ? Repository<LetterEntity>
    : T extends 'letterAttachment'
      ? Repository<LetterAttachmentEntity>
      : T extends 'letterComment'
        ? Repository<LetterCommentEntity>
        : Repository<LetterTotalEntity> {
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
    if (type === 'letterTotal')
      return (
        entityManager
          ? entityManager.getRepository(LetterTotalEntity)
          : this.letterTotal
      ) as any;
    throw new Error('Invalid repository type');
  }
}
