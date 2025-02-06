import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { DefaultEntity } from '../default';
import { TemplateTotalColumn } from '@app/database/column/template.total.column';
import { TemplateEntity } from './template';

@Entity({ name: TemplateTotalColumn.table })
export class TemplateTotalEntity extends DefaultEntity {
  @PrimaryColumn({ name: TemplateTotalColumn.templateId, type: 'int' })
  templateId: number;

  @Column({ name: TemplateTotalColumn.forkCount, type: 'int', default: 0 })
  forkCount: number;

  @Column({ name: TemplateTotalColumn.viewCount, type: 'int', default: 0 })
  viewCount: number;

  @OneToOne(() => TemplateEntity, { nullable: false })
  template: TemplateEntity;

  static of(templateId : number,creator : string) {
    const entity = new TemplateTotalEntity();
    entity.templateId = templateId;
    entity.creator = creator;
    entity.updator = creator;
    return entity;
  }
}
