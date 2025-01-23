export const LetterColumn = {
  table: 'tb_vm_letr',
  letterId: 'letr_id',
  title: 'tit',
  body: 'body',
  commentYn: 'cmt_yn',
  attendYn: 'atd_yn',
  publicYn: 'pub_yn',
  password: 'pwd',
} as const;

export type LetterColumn = (typeof LetterColumn)[keyof typeof LetterColumn];
