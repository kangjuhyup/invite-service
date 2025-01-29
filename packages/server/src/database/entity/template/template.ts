import {
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TemplateColumn } from '../../column/template.column';
import { DefaultEntity } from '../default';
import { TemplateAttachmentEntity } from './template.attachment';

@Entity({ name: TemplateColumn.table })
export class TemplateEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({ name: TemplateColumn.templateId })
  templateId: number;
  @PrimaryColumn({ name: TemplateColumn.userId })
  userId: string;

  @OneToMany(
    () => TemplateAttachmentEntity,
    (templateAttachment) => templateAttachment.template,
  )
  templateAttachment?: TemplateAttachmentEntity[];

  static of(userId: string, creator:string) {
    const template = new TemplateEntity();
    template.userId = userId;
    template.creator = creator;
    template.updator = creator;
    return template;
  }
}
