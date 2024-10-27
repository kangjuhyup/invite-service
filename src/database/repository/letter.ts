import { LetterEntity } from '@database/entity/letter';
import { LetterAttachmentEntity } from '@database/entity/letter.attachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { InsertLetter, InsertLetterAttachment } from './param/letter';

@Injectable()
export class LetterRepository {
  constructor(
    @InjectRepository(LetterEntity)
    private readonly letter: Repository<LetterEntity>,
    @InjectRepository(LetterAttachmentEntity)
    private readonly letterAttachment: Repository<LetterAttachmentEntity>,
  ) {}

  async insertLetter({ letter, entityManager }: InsertLetter) {
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
