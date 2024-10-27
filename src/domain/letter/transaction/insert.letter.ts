import { AttachmentRepository } from '@database/repository/attachment';
import { LetterRepository } from '@database/repository/letter';
import { Attachment } from '@database/repository/param/attachment';
import { Letter } from '@database/repository/param/letter';
import { BaseTransaction } from '@database/transaction.base';
import { DataSource, EntityManager } from 'typeorm';

interface Input {
  letter: Letter;
  thumnailAttachment: Attachment;
  backgroundAttachment: Attachment;
  letterAttachment: Attachment;
  componentAttachments: Array<Attachment>;
}

export class InsertLetterTrasnaction extends BaseTransaction<Input, number> {
  constructor(
    private readonly ds: DataSource,
    private readonly letterRepository: LetterRepository,
    private readonly attachmentRepository: AttachmentRepository,
  ) {
    super(ds);
  }

  protected async execute(
    {
      letter,
      thumnailAttachment,
      letterAttachment,
      backgroundAttachment,
      componentAttachments,
    }: Input,
    entityManager: EntityManager,
  ): Promise<number> {
    const letterId = await this._insertLetter(letter, entityManager);
    const attachmentIds = await this._insertAttachment(
      [
        thumnailAttachment,
        letterAttachment,
        backgroundAttachment,
        ...componentAttachments,
      ],
      entityManager,
    );
    await this._insertLetterAttachment(letterId, attachmentIds, entityManager);
    return letterId;
  }

  private async _insertLetter(
    letter,
    entityManager: EntityManager,
  ): Promise<number> {
    return (await this.letterRepository.insertLetter({ letter, entityManager }))
      .identifiers[0].id;
  }
  private async _insertAttachment(
    attachments,
    entityManager: EntityManager,
  ): Promise<number[]> {
    await this.attachmentRepository.bulkInsertAttachments({
      attachments,
      entityManager,
    });
    return await this.attachmentRepository.selectAttachmentIds({
      attachmentPaths: attachments.map((att) => att.attachmentPath),
      entityManager,
    });
  }
  private async _insertLetterAttachment(
    letterId: number,
    attachmentIds: number[],
    entityManager: EntityManager,
  ) {
    return await this.letterRepository.insertLetterAttachment({
      letterAttachments: attachmentIds.map((a) => ({
        letterId,
        attachmentId: a,
      })),
      entityManager,
    });
  }
}
