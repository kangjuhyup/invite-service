import { AttachmentEntity } from 'packages/server/src/database/entity/attachment';
import { DefaultParameter } from './default';
export type Attachment = Pick<AttachmentEntity, 'attachmentPath' | 'creator' | 'updator'>;
export declare class SelectAttachment extends DefaultParameter {
    attachmentId: number;
    attachmentIds: number[];
    attachmentPath: string;
    attachmentPaths: string[];
}
export declare class InsertAttachment extends DefaultParameter {
    attachments: Array<Attachment>;
    attachment: Attachment;
}
