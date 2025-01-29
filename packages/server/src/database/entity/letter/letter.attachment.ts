import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from '../default';
import { LetterEntity } from './letter';
import { AttachmentEntity } from '../attachment/attachment';
import { LetterAttachmentCode } from '@app/util/attachment';
import { AttachmentColumn } from '../../column/attachment.column';
import { LetterAttachmentColumn } from '../../column/letter.attachment.column';
import { LetterColumn } from '../../column/letter.column';

@Entity({ name: LetterAttachmentColumn.table })
export class LetterAttachmentEntity extends DefaultEntity {
  @PrimaryColumn({ name: LetterColumn.letterId, type: 'int' })
  letterId: number;

  @PrimaryColumn({
    name: LetterAttachmentColumn.attachmentCode,
    type: process.env.NODE_ENV === 'test' ? 'varchar' : 'char',
    length: 5,
  })
  attachmentCode: LetterAttachmentCode;

  @PrimaryColumn({ name: AttachmentColumn.attachmentId, type: 'int' })
  attachmentId: number;

  @ManyToOne(() => LetterEntity, { nullable: false })
  @JoinColumn({ name: LetterColumn.letterId })
  letter: LetterEntity;

  @ManyToOne(() => AttachmentEntity, { nullable: false })
  @JoinColumn({ name: AttachmentColumn.attachmentId })
  attachment: AttachmentEntity;

  static of(
    letterId: number,
    attachmentCode: LetterAttachmentCode,
    attachmentId: number,
    creator: string,
  ) {
    const letterAttachment = new LetterAttachmentEntity();
    letterAttachment.letterId = letterId;
    letterAttachment.attachmentCode = attachmentCode;
    letterAttachment.attachmentId = attachmentId;
    letterAttachment.creator = creator;
    letterAttachment.updator = creator;
    return letterAttachment;
  }
}
