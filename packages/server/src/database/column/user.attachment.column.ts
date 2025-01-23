export const UserAttachmentColumn = {
  table: 'tb_vl_user_atch',
  attachmentCode: 'atch_cd',
} as const;

export type UserAttachmentColumn =
  (typeof UserAttachmentColumn)[keyof typeof UserAttachmentColumn];
