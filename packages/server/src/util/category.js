"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterCategoryCode = exports.LetterCategory = void 0;
exports.getCategoryFromCode = getCategoryFromCode;
exports.getCodeFromCategory = getCodeFromCategory;
exports.LetterCategory = {
    WEDDING: '결혼식',
    BIRTHDAY: '생일',
    ANNIVERSARY: '기념일',
    PARTY: '파티',
    GRADUATION: '졸업',
    CORPORATE: '행사',
};
exports.LetterCategoryCode = {
    WEDDING: 'LT001',
    BIRTHDAY: 'LT002',
    ANNIVERSARY: 'LT003',
    PARTY: 'LT004',
    GRADUATION: 'LT005',
    CORPORATE: 'LT006',
};
const categoryToCodeMap = {
    [exports.LetterCategory.WEDDING]: exports.LetterCategoryCode.WEDDING,
    [exports.LetterCategory.BIRTHDAY]: exports.LetterCategoryCode.BIRTHDAY,
    [exports.LetterCategory.ANNIVERSARY]: exports.LetterCategoryCode.ANNIVERSARY,
    [exports.LetterCategory.PARTY]: exports.LetterCategoryCode.PARTY,
    [exports.LetterCategory.GRADUATION]: exports.LetterCategoryCode.GRADUATION,
    [exports.LetterCategory.CORPORATE]: exports.LetterCategoryCode.CORPORATE,
};
const codeToCategoryMap = {
    [exports.LetterCategoryCode.WEDDING]: exports.LetterCategory.WEDDING,
    [exports.LetterCategoryCode.BIRTHDAY]: exports.LetterCategory.BIRTHDAY,
    [exports.LetterCategoryCode.ANNIVERSARY]: exports.LetterCategory.ANNIVERSARY,
    [exports.LetterCategoryCode.PARTY]: exports.LetterCategory.PARTY,
    [exports.LetterCategoryCode.GRADUATION]: exports.LetterCategory.GRADUATION,
    [exports.LetterCategoryCode.CORPORATE]: exports.LetterCategory.CORPORATE,
};
function getCategoryFromCode(code) {
    return codeToCategoryMap[code];
}
function getCodeFromCategory(category) {
    return categoryToCodeMap[category];
}
//# sourceMappingURL=category.js.map