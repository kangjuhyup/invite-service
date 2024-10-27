import { AttachmentEntity } from '@database/entity/attachment';
import { DefaultParameter } from './default';

export type Attachment = Pick<AttachmentEntity, 'attachmentPath'>;

export class SelectAttachment extends DefaultParameter {
  attachmentId: number;
  attachmentIds: number[];
  attachmentPath: string;
  attachmentPaths: string[];
}

export class InsertAttachment extends DefaultParameter {
  attachments: Array<Attachment>;
  attachment: Attachment;
}
