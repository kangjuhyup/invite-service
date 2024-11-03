export const LetterTotalColumn = {
  table: 'tb_vs_letr',
  attendantcount: 'atd_cnt',
  viewCount: 'vw_cnt',
  commentCount: 'cmt_cnt',
} as const;

export type LetterTotalColumn =
  (typeof LetterTotalColumn)[keyof typeof LetterTotalColumn];
