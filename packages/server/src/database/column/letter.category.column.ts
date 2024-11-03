export const LetterCategoryColumn = {
  table: 'tb_vc_letr',
  letterCategoryCode: 'letr_ctg_cd',
  letterCategoryDetail: 'letr_ctg_dtl',
} as const;

export type LetterCategoryColumn =
  (typeof LetterCategoryColumn)[keyof typeof LetterCategoryColumn];
