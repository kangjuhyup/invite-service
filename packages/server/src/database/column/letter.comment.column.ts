export const LetterCommentColumn = {
  table: 'tb_vm_letr_cmt',
  commentId: 'cmt_id',
  editor: 'edt_nm',
  password: 'pwd',
  body: 'body',
} as const;

export type LetterCommentColumn =
  (typeof LetterCommentColumn)[keyof typeof LetterCommentColumn];
