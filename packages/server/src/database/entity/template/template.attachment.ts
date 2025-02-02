import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { TemplateAttachmentColumn } from '../../column/template.attachment.column.';
import { DefaultEntity } from '../default';
import { TemplateColumn } from '../../column/template.column';
import { AttachmentColumn } from '../../column/attachment.column';
import { AttachmentEntity } from '../attachment/attachment';
import { TemplateEntity } from './template';

@Entity({ name: TemplateAttachmentColumn.table })
export class TemplateAttachmentEntity extends DefaultEntity {
  @PrimaryColumn({ name: TemplateColumn.templateId })
  templateId: number;

  @Column({
    name: TemplateAttachmentColumn.attachmentCode,
    type: 'char',
    length: 5,
  })
  attachmentCode: string;

  @PrimaryColumn({ name: AttachmentColumn.attachmentId, type: 'int' })
  attachmentId: number;

  @ManyToOne(() => TemplateEntity)
  @JoinColumn({ name: TemplateColumn.templateId })
  template: TemplateEntity;

  @ManyToOne(() => AttachmentEntity, { nullable: false })
  @JoinColumn({ name: AttachmentColumn.attachmentId })
  attachment: AttachmentEntity;

  static of(templateId: number, attachmentCode: string, attachmentId: number, creator: string) {
    const templateAttachment = new TemplateAttachmentEntity();
    templateAttachment.templateId = templateId;
    templateAttachment.attachmentCode = attachmentCode;
    templateAttachment.attachmentId = attachmentId;
    templateAttachment.creator = creator;
    templateAttachment.updator = creator;
    return templateAttachment;
  }
}
