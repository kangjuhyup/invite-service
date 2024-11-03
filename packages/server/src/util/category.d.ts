export declare const LetterCategory: {
    readonly WEDDING: "결혼식";
    readonly BIRTHDAY: "생일";
    readonly ANNIVERSARY: "기념일";
    readonly PARTY: "파티";
    readonly GRADUATION: "졸업";
    readonly CORPORATE: "행사";
};
export type LetterCategory = (typeof LetterCategory)[keyof typeof LetterCategory];
export declare const LetterCategoryCode: {
    readonly WEDDING: "LT001";
    readonly BIRTHDAY: "LT002";
    readonly ANNIVERSARY: "LT003";
    readonly PARTY: "LT004";
    readonly GRADUATION: "LT005";
    readonly CORPORATE: "LT006";
};
export type LetterCategoryCode = (typeof LetterCategoryCode)[keyof typeof LetterCategoryCode];
export declare function getCategoryFromCode(code: LetterCategoryCode): LetterCategory;
export declare function getCodeFromCategory(category: LetterCategory): LetterCategoryCode;
