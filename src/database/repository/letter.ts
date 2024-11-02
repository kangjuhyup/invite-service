import { LetterEntity } from '@database/entity/letter';
import { LetterAttachmentEntity } from '@database/entity/letter.attachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  InsertLetter,
  InsertLetterAttachment,
  SelectLetter,
} from './param/letter';
import { YN } from '@util/yn';
import { DefaultColumn } from '@database/column/default';
import { LetterAttachmentColumn } from '@database/column/letter.attachment.column';
import { LetterAttachmentCode } from '@util/attachment';

@Injectable()
export class LetterRepository {
  constructor(
    @InjectRepository(LetterEntity)
    private readonly letter: Repository<LetterEntity>,
    @InjectRepository(LetterAttachmentEntity)
    private readonly letterAttachment: Repository<LetterAttachmentEntity>,
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
    return await repo
      .createQueryBuilder('letter')
      .innerJoinAndSelect(
        'letter.letterAttachment',
        'letterAttachment',
        `letterAttachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'letter.letterDetail',
        'letterDetail',
        `letterDetail.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect(
        'letterAttachment.attachment',
        'attachment',
        `attachment.${DefaultColumn.useYn} = :useYn`,
        { useYn: YN.Y },
      )
      .innerJoinAndSelect('user', 'letter.user')
      .where({ letterId, useYn: YN.Y })
      .getOne();
  }

  async insertLetter({ letter, entityManager }: InsertLetter) {
    console.log('insertLetter');
    const repo = this._getRepository('letter', entityManager);
    return await repo.insert(letter);
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

  private _getRepository(
    type: 'letter' | 'letterAttachment',
    entityManager?: EntityManager,
  ) {
    if (type === 'letter')
      return entityManager
        ? entityManager.getRepository(LetterEntity)
        : this.letter;
    if (type === 'letterAttachment')
      return entityManager
        ? entityManager.getRepository(LetterAttachmentEntity)
        : this.letterAttachment;
  }
}
