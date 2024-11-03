import { LetterCategoryCode } from 'packages/server/src/util/category';
export declare class AddLetterRequest {
    category: LetterCategoryCode;
    title: string;
    body?: string;
    commentYn?: boolean;
    attendYn?: boolean;
}
