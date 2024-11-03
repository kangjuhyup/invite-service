import { DefaultEntity } from './default';
import { LetterAttachmentEntity } from './letter.attachment';
export declare class AttachmentEntity extends DefaultEntity {
    attachmentId: number;
    attachmentPath: string;
    letterAttachment?: LetterAttachmentEntity[];
}
