import { TemplateEntity } from '@app/database/entity/template/template';
import { DefaultParameter } from './default';
import { TemplateAttachmentEntity } from '@app/database/entity/template/template.attachment';

export class SelectTemplate extends DefaultParameter {
  startAt?: number;
  limit: number;
  userId: string;
  templateId: number;
}

export class InsertTemplate extends DefaultParameter {
  template: TemplateEntity;
}

export class InsertTemplateAttachment extends DefaultParameter {
  templateAttachments: TemplateAttachmentEntity[];
}