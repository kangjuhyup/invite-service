export const TemplateAttachmentColumn = {
  table: 'tb_vl_tmpl_atch',
  attachmentCode: 'atch_cd',
} as const;

export type TemplateAttachmentColumn =
  (typeof TemplateAttachmentColumn)[keyof typeof TemplateAttachmentColumn];
