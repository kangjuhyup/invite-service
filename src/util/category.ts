export const LetterCategory = {
  WEDDING: '결혼식', // 결혼식
  BIRTHDAY: '생일', // 생일
  ANNIVERSARY: '기념일', // 기념일
  PARTY: '파티', // 파티
  GRADUATION: '졸업', // 졸업
  CORPORATE: '행사', // 회사 행사
} as const;

export type LetterCategory =
  (typeof LetterCategory)[keyof typeof LetterCategory];

export const LetterCategoryCode = {
  WEDDING: 'LT001', // 결혼식
  BIRTHDAY: 'LT002', // 생일
  ANNIVERSARY: 'LT003', // 기념일
  PARTY: 'LT004', // 파티
  GRADUATION: 'LT005', // 졸업
  CORPORATE: 'LT006', // 회사 행사
} as const;

export type LetterCategoryCode =
  (typeof LetterCategoryCode)[keyof typeof LetterCategoryCode];
