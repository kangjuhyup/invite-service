import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from './default';
import { LetterEntity } from './letter';
import { AttachmentEntity } from './attachment';
import { LetterAttachmentColumn } from '@database/column/letter.attachment.column';
import { LetterColumn } from '@database/column/letter.column';
import { AttachmentColumn } from '@database/column/attachment.column';

@Entity({ name: LetterAttachmentColumn.table })
export class LetterAttachmentEntity extends DefaultEntity {
  @PrimaryColumn({ name: LetterColumn.letterId, type: 'int' })
  letterId: number;

  @PrimaryColumn({
    name: LetterAttachmentColumn.attachmentCode,
    type: 'char',
    length: 5,
  })
  attachmentCode: string;

  @PrimaryColumn({ name: AttachmentColumn.attachmentId, type: 'int' })
  attachmentId: number;

  @ManyToOne(() => LetterEntity, { nullable: false })
  @JoinColumn({ name: LetterColumn.letterId })
  letter: LetterEntity;

  @ManyToOne(() => AttachmentEntity, { nullable: false })
  @JoinColumn({ name: AttachmentColumn.attachmentId })
  attachment: AttachmentEntity;
}
