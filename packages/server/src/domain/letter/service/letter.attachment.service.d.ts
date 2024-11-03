import { StorageService } from 'packages/server/src/storage/storage.service';
import { LetterBaseService } from './letter.base.service';
import { LetterAttachmentCode } from 'packages/server/src/util/attachment';
import { AttachmentDetail } from '../transaction/insert.letter';
export declare class LetterAttachmentService extends LetterBaseService {
    private readonly storage;
    private readonly logger;
    constructor(storage: StorageService);
    validateSessionAndRetrieveMetadata(sessionKey: string, objectKey: string, componentCount: number): Promise<{
        thumbnailMeta: any;
        letterMeta: any;
        backgroundMeta: any;
        componentMetas: any[];
    }>;
    private getMetadata;
    private deleteInvalidObjects;
    createAttachmentDetail(meta: any, bucket: string, code: LetterAttachmentCode, objectKey: string): AttachmentDetail;
}
