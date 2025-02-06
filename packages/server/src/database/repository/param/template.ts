import { TemplateEntity } from '@app/database/entity/template/template';
import { DefaultParameter } from './default';
import { TemplateAttachmentEntity } from '@app/database/entity/template/template.attachment';
import { TemplateTotalEntity } from '@app/database/entity/template/template.total';
import { LetterCategoryCode } from '@app/util/category';

export class SelectTemplate extends DefaultParameter {
  startAt?: number;
  limit: number;
  userId: string;
  templateId: number;
  category: LetterCategoryCode;
  title: string;
}

export class InsertTemplate extends DefaultParameter {
  template: TemplateEntity;
}

export class InsertTemplateTotal extends DefaultParameter {
  templateTotal: TemplateTotalEntity;
}

export class InsertTemplateAttachment extends DefaultParameter {
  templateAttachments: TemplateAttachmentEntity[];
}