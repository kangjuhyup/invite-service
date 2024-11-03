import { DefaultEntity } from './default';
import { LetterEntity } from './letter';
import { AttachmentEntity } from './attachment';
import { LetterAttachmentCode } from 'packages/server/src/util/attachment';
export declare class LetterAttachmentEntity extends DefaultEntity {
    letterId: number;
    attachmentCode: LetterAttachmentCode;
    angle: number;
    width: number;
    height: number;
    x: number;
    y: number;
    z: number;
    attachmentId: number;
    letter: LetterEntity;
    attachment: AttachmentEntity;
}
