import { AttachmentEntity } from '@app/database/entity/attachment';
import { LetterAttachmentEntity } from '@app/database/entity/letter.attachment';
import { AttachmentRepository } from '@app/database/repository/attachment';
import { LetterRepository } from '@app/database/repository/letter';
import { Attachment } from '@app/database/repository/param/attachment';
import { LetterAttachment } from '@app/database/repository/param/letter';
import { BaseTransaction } from '@app/database/transaction.base';
import { DataSource, EntityManager } from 'typeorm';

export type AttachmentDetail = Pick<AttachmentEntity, 'attachmentPath'> &
  Pick<
    LetterAttachmentEntity,
    'attachmentCode' | 'angle' | 'width' | 'height' | 'x' | 'y' | 'z'
  >;

export abstract class LetterTransactionBase<I, O> extends BaseTransaction<I, O> {
  constructor(
    protected readonly ds: DataSource,
    protected readonly letterRepository: LetterRepository,
    protected readonly attachmentRepository: AttachmentRepository,
    protected readonly transactionName: string,
  ) {
    super(ds);
  }

  protected async insertAttachment(
    attachmentDetail: AttachmentDetail,
    entityManager: EntityManager,
  ): Promise<number> {
    const attachment: Attachment = {
      attachmentPath: attachmentDetail.attachmentPath,
      creator: this.transactionName,
      updator: this.transactionName,
    };

    const result = await this.attachmentRepository.insertAttachment({
      attachment,
      entityManager,
    });
    return result.identifiers[0].attachmentId;
  }

  protected async insertLetterAttachments(
    letterId: number,
    attachments: Array<
      AttachmentDetail & {
        attachmentId: number;
      }
    >,
    entityManager: EntityManager,
  ): Promise<void> {
    const letterAttachments: LetterAttachment[] = attachments.map((a) => ({
      letterId,
      attachmentId: a.attachmentId,
      attachmentCode: a.attachmentCode,
      angle: a.angle,
      width: a.width,
      height: a.height,
      x: a.x,
      y: a.y,
      z: a.z,
      creator: this.transactionName,
      updator: this.transactionName,
    }));

    await this.letterRepository.insertLetterAttachment({
      letterAttachments,
      entityManager,
    });
  }
}
