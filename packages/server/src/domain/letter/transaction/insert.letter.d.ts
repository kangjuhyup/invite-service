import { AttachmentEntity } from 'packages/server/src/database/entity/attachment';
import { LetterAttachmentEntity } from 'packages/server/src/database/entity/letter.attachment';
import { AttachmentRepository } from 'packages/server/src/database/repository/attachment';
import { LetterRepository } from 'packages/server/src/database/repository/letter';
import { Letter } from 'packages/server/src/database/repository/param/letter';
import { BaseTransaction } from 'packages/server/src/database/transaction.base';
import { DataSource, EntityManager } from 'typeorm';
export type AttachmentDetail = Pick<AttachmentEntity, 'attachmentPath'> & Pick<LetterAttachmentEntity, 'attachmentCode' | 'angle' | 'width' | 'height' | 'x' | 'y' | 'z'>;
interface Input {
    letter: Omit<Letter, 'creator' | 'updator'>;
    thumbnailAttachment: AttachmentDetail;
    backgroundAttachment: AttachmentDetail;
    letterAttachment: AttachmentDetail;
    componentAttachments: Array<AttachmentDetail>;
}
export declare class InsertLetterTransaction extends BaseTransaction<Input, number> {
    private readonly ds;
    private readonly letterRepository;
    private readonly attachmentRepository;
    private readonly creator;
    constructor(ds: DataSource, letterRepository: LetterRepository, attachmentRepository: AttachmentRepository);
    protected execute({ letter, thumbnailAttachment, letterAttachment, backgroundAttachment, componentAttachments, }: Input, entityManager: EntityManager): Promise<number>;
    private _insertLetter;
    private _insertAttachment;
    private _insertLetterAttachments;
}
export {};
