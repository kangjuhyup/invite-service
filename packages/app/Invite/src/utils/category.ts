import {LetterCategoryCode} from '../api/letter';

/**
 * 초대장 카테고리 코드를 한글 표시 이름으로 변환합니다.
 * @param category 초대장 카테고리 코드
 * @returns 카테고리의 한글 표시 이름
 */
export const getCategoryDisplayName = (category: LetterCategoryCode): string => {
  const displayNames: Record<LetterCategoryCode, string> = {
    [LetterCategoryCode.ANNIVERSARY]: '기념',
    [LetterCategoryCode.BIRTHDAY]: '생일',
    [LetterCategoryCode.PARTY]: '파티',
    [LetterCategoryCode.WEDDING]: '결혼',
    [LetterCategoryCode.ETC]: '기타',
  };
  return displayNames[category] || category;
};
