import { AttachmentEntity } from 'packages/server/src/database/entity/attachment';
import { Repository } from 'typeorm';
import { InsertAttachment, SelectAttachment } from './param/attachment';
export declare class AttachmentRepository {
    private readonly attachment;
    constructor(attachment: Repository<AttachmentEntity>);
    selectAttachments({ attachmentPaths, entityManager, }: Pick<SelectAttachment, 'attachmentPaths' | 'entityManager'>): Promise<AttachmentEntity[]>;
    insertAttachment({ attachment, entityManager, }: Omit<InsertAttachment, 'attachments'>): Promise<import("typeorm").InsertResult>;
    bulkInsertAttachments({ attachments, entityManager, }: Omit<InsertAttachment, 'attachment'>): Promise<import("typeorm").InsertResult>;
    private _getRepository;
}
