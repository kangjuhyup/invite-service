export const LetterCommentColumn = {
  table: 'tb_vm_ltr_cmt',
  commentId: 'cmt_id',
  editor: 'edt_nm',
  body: 'body',
} as const;

export type LetterCommentColumn =
  (typeof LetterCommentColumn)[keyof typeof LetterCommentColumn];
