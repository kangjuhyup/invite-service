export const TemplateColumn = {
  table: 'tb_vm_tmpl',
  templateId: 'tmpl_id',
  userId: 'user_id',
} as const;

export type TemplateColumn =
  (typeof TemplateColumn)[keyof typeof TemplateColumn];
