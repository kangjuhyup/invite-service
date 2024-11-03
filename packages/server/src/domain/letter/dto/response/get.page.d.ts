import { LetterCategoryCode } from 'packages/server/src/util/category';
declare class LetterPageItem {
    id: number;
    title: string;
    category: LetterCategoryCode;
    thumbnail: string;
}
export declare class GetLetterPageResponse {
    totalCount: number;
    items: LetterPageItem[];
}
export {};
