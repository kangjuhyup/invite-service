import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from './default';
import { LetterAttachmentEntity } from './letter.attachment';
import { AttachmentColumn } from 'packages/server/src/database/column/attachment.column';

@Entity({
  name: AttachmentColumn.table,
})
export class AttachmentEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({ name: AttachmentColumn.attachmentId })
  attachmentId: number;

  @Column({
    name: AttachmentColumn.attachmentPath,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  attachmentPath: string;

  @OneToMany(
    () => LetterAttachmentEntity,
    (letterAttachment) => letterAttachment.attachment,
    { nullable: true },
  )
  letterAttachment?: LetterAttachmentEntity[];
}
