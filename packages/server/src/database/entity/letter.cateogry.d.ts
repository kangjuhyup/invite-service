import { LetterCategory, LetterCategoryCode } from 'packages/server/src/util/category';
import { DefaultEntity } from './default';
import { LetterEntity } from './letter';
export declare class LetterCategoryEntity extends DefaultEntity {
    letterCategoryCode: LetterCategoryCode;
    letterCategoryDetail: LetterCategory;
    letter?: LetterEntity[];
}
