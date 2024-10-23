export const LetterAttachmentColumn = {
  table: 'tb_vl_letr_atch',
  attachmentCode: 'atch_cd',
} as const;

export type LetterAttachmentColumn =
  (typeof LetterAttachmentColumn)[keyof typeof LetterAttachmentColumn];
