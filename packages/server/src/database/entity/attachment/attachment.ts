import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { DefaultEntity } from '../default';
import { LetterAttachmentEntity } from '../letter/letter.attachment';
import { AttachmentColumn } from '../../column/attachment.column';
import { UserAttachmentEntity } from '../user/user.attachment';
import { TemplateAttachmentEntity } from '../template/template.attachment';
import { MetadataEntity } from './metadata';

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

  @OneToOne(() => MetadataEntity, (metadata) => metadata.attachment, { cascade: true })
  @JoinColumn({ name: AttachmentColumn.attachmentId })
  metadata: MetadataEntity;

  @OneToMany(
    () => LetterAttachmentEntity,
    (letterAttachment) => letterAttachment.attachment,
    { nullable: true },
  )
  letterAttachment?: LetterAttachmentEntity[];

  @OneToMany(
    () => UserAttachmentEntity,
    (userAttachment) => userAttachment.attachment,
    { nullable: true },
  )
  userAttachment?: UserAttachmentEntity[];

  @OneToMany(
    () => TemplateAttachmentEntity,
    (templateAttachment) => templateAttachment.attachment,
    { nullable: true },
  )
  templateAttachment?: TemplateAttachmentEntity[];

  static of(attachmentPath: string, creator: string) {
    const attachment = new AttachmentEntity();
    attachment.attachmentPath = attachmentPath;
    attachment.creator = creator;
    attachment.updator = creator;
    return attachment;
  }

  setTemplatePath(
  ) {
    this.attachmentPath = `tmp-${this.attachmentPath}`;
    return this;
  }

  setUpdator(updator: string) {
    this.creator = updator;
    this.updator = updator;
    return this;
  }

  deleteId() {
    this.attachmentId = undefined;
    this.metadata = this.metadata ? {
      ...this.metadata,
      attachmentId: undefined,
    } : null;
    return this;
  }
} 
