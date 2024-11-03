import { DefaultEntity } from './default';
import { LetterCategoryCode } from 'packages/server/src/util/category';
import { YN } from 'packages/server/src/util/yn';
import { UserEntity } from './user';
import { LetterCategoryEntity } from './letter.cateogry';
import { LetterCommentEntity } from './letter.comment';
import { LetterAttachmentEntity } from './letter.attachment';
import { LetterTotalEntity } from './letter.total';
export declare class LetterEntity extends DefaultEntity {
    letterId: number;
    userId: string;
    letterCategoryCode: LetterCategoryCode;
    title: string;
    body?: string;
    commentYn: YN;
    attendYn: YN;
    user: UserEntity;
    letterCategory: LetterCategoryEntity;
    letterComment?: LetterCommentEntity[];
    letterAttachment: LetterAttachmentEntity[];
    letterTotal: LetterTotalEntity;
}
