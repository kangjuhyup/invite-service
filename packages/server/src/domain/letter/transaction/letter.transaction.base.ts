import { AttachmentEntity } from '@app/database/entity/attachment/attachment';
import { MetadataEntity } from '@app/database/entity/attachment/metadata';
import { LetterAttachmentEntity } from '@app/database/entity/letter/letter.attachment';
import { AttachmentRepository } from '@app/database/repository/attachment';
import { LetterRepository } from '@app/database/repository/letter';
import { BaseTransaction } from '@app/database/transaction.base';
import { DataSource, EntityManager } from 'typeorm';

export type AttachmentDetail = Pick<AttachmentEntity, 'attachmentPath'> &
  Pick<LetterAttachmentEntity, 'attachmentCode'> &
  Pick<
    MetadataEntity,
    'angle' | 'width' | 'height' | 'x' | 'y' | 'z' | 'font' | 'color' | 'bold'
  >;

export abstract class LetterTransactionBase<I, O> extends BaseTransaction<
  I,
  O
> {
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
    const attachment = AttachmentEntity.of(
      attachmentDetail.attachmentPath,
      this.transactionName,
    );
    const result = await this.attachmentRepository.insertAttachment({
      attachment,
      entityManager,
    });
    const attachmentId = result.identifiers[0].attachmentId;
    const metadata = MetadataEntity.of(
      this.transactionName,
      attachmentId,
      attachmentDetail.angle,
      attachmentDetail.width,
      attachmentDetail.height,
      attachmentDetail.x,
      attachmentDetail.y,
      attachmentDetail.z,
      attachmentDetail.font,
      attachmentDetail.color,
      attachmentDetail.bold,
    );
    await this.attachmentRepository.insertMetadata({
      metadata,
      entityManager,
    });
    return attachmentId;
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
    const letterAttachments = attachments.map((a) =>
      LetterAttachmentEntity.of(
        letterId,
        a.attachmentCode,
        a.attachmentId,
        this.transactionName,
      ),
    );

    await this.letterRepository.insertLetterAttachment({
      letterAttachments,
      entityManager,
    });
  }
}
