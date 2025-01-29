import { AttachmentEntity } from '@app/database/entity/attachment/attachment';
import { DefaultParameter } from './default';
import { MetadataEntity } from '@app/database/entity/attachment/metadata';

export class SelectAttachment extends DefaultParameter {
  attachmentId: number;
  attachmentIds: number[];
  attachmentPath: string;
  attachmentPaths: string[];
}

export class InsertAttachment extends DefaultParameter {
  attachments: Array<AttachmentEntity>;
  attachment: AttachmentEntity;
}

export class InsertMetadata extends DefaultParameter {
  metadatas: Array<MetadataEntity>;
  metadata: MetadataEntity;
}

export class DeleteAttachment extends DefaultParameter {
  attachmentId: number;
  attachmentIds: number[];
}
