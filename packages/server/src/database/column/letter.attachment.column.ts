export const LetterAttachmentColumn = {
  table: 'tb_vl_letr_atch',
  attachmentCode: 'atch_cd',
  angle: 'ang',
  width: 'w',
  height: 'h',
  x: 'x',
  y: 'y',
  z: 'z',
  font: 'font',
  color: 'clr',
  bold: 'bld',
} as const;

export type LetterAttachmentColumn =
  (typeof LetterAttachmentColumn)[keyof typeof LetterAttachmentColumn];
