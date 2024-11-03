import { LetterEntity } from 'packages/server/src/database/entity/letter';
import { LetterAttachmentEntity } from 'packages/server/src/database/entity/letter.attachment';
import { Repository } from 'typeorm';
import { InsertLetter, InsertLetterAttachment, SelectLetter } from './param/letter';
export declare class LetterRepository {
    private readonly letter;
    private readonly letterAttachment;
    constructor(letter: Repository<LetterEntity>, letterAttachment: Repository<LetterAttachmentEntity>);
    selectLetterFromUser({ userId, limit, skip, entityManager, }: Pick<SelectLetter, 'userId' | 'limit' | 'skip' | 'entityManager'>): Promise<[LetterEntity[], number]>;
    selectLetterFromId({ letterId, entityManager, }: Pick<SelectLetter, 'letterId' | 'entityManager'>): Promise<LetterEntity>;
    insertLetter({ letter, entityManager }: InsertLetter): Promise<import("typeorm").InsertResult>;
    insertLetterAttachment({ letterAttachments, entityManager, }: InsertLetterAttachment): Promise<void>;
    private _getRepository;
}
