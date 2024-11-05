import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from './default';
import { LetterEntity } from './letter';
import { AttachmentEntity } from './attachment';
import { LetterAttachmentCode } from '@app/util/attachment';
import { AttachmentColumn } from '../column/attachment.column';
import { LetterAttachmentColumn } from '../column/letter.attachment.column';
import { LetterColumn } from '../column/letter.column';

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

  @Column({
    name: LetterAttachmentColumn.angle,
    type: 'int',
    nullable: false,
    default: 0,
  })
  angle: number;
  @Column({ name: LetterAttachmentColumn.width, type: 'int', nullable: false })
  width: number;
  @Column({ name: LetterAttachmentColumn.height, type: 'int', nullable: false })
  height: number;
  @Column({
    name: LetterAttachmentColumn.x,
    type: 'int',
    nullable: false,
    default: 0,
  })
  x: number;
  @Column({
    name: LetterAttachmentColumn.y,
    type: 'int',
    nullable: false,
    default: 0,
  })
  y: number;

  @Column({
    name: LetterAttachmentColumn.z,
    type: 'int',
    nullable: false,
    default: 0,
  })
  z: number;

  @PrimaryColumn({ name: AttachmentColumn.attachmentId, type: 'int' })
  attachmentId: number;

  @ManyToOne(() => LetterEntity, { nullable: false })
  @JoinColumn({ name: LetterColumn.letterId })
  letter: LetterEntity;

  @ManyToOne(() => AttachmentEntity, { nullable: false })
  @JoinColumn({ name: AttachmentColumn.attachmentId })
  attachment: AttachmentEntity;
}
