import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TemplateColumn } from '../../column/template.column';
import { DefaultEntity } from '../default';
import { TemplateAttachmentEntity } from './template.attachment';
import { LetterCategoryColumn } from '@app/database/column/letter.category.column';
import { TemplateTotalEntity } from './template.total';
import { LetterCategoryCode } from '@app/util/category';

@Entity({ name: TemplateColumn.table })
export class TemplateEntity extends DefaultEntity {
  @PrimaryGeneratedColumn({ name: TemplateColumn.templateId })
  templateId: number;
  @Column({ name: TemplateColumn.userId })
  userId: string;

  @Column({ name: TemplateColumn.title })
  title: string;

  @Column({ name: LetterCategoryColumn.letterCategoryCode })
  category: LetterCategoryCode;

  @OneToMany(
    () => TemplateAttachmentEntity,
    (templateAttachment) => templateAttachment.template,
  )
  @JoinColumn({ name: TemplateColumn.templateId })
  templateAttachment?: TemplateAttachmentEntity[];

  @OneToOne(() => TemplateTotalEntity)
  @JoinColumn({ name: TemplateColumn.templateId })
  templateTotal: TemplateTotalEntity;

  static of(userId: string, title: string, category: LetterCategoryCode, creator:string) {
    const template = new TemplateEntity();
    template.userId = userId;
    template.title = title;
    template.category = category;
    template.creator = creator;
    template.updator = creator;
    return template;
  }
}
