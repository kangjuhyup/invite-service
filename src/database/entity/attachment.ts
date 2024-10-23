import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultEntity } from './default';
import { LetterAttachmentEntity } from './letter.attachment';

@Entity()
export class AttachmentEntity extends DefaultEntity {
  @PrimaryGeneratedColumn()
  attachmentId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  attachmentPath: string;

  @OneToMany(
    () => LetterAttachmentEntity,
    (letterAttachment) => letterAttachment.attachment,
    { nullable: true },
  )
  letterAttachment?: LetterAttachmentEntity[];
}
