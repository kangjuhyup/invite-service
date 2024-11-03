export const AttachmentColumn = {
  table: 'tb_vm_atch',
  attachmentId: 'atch_id',
  attachmentPath: 'atch_pth',
} as const;

export type AttachmentColumn =
  (typeof AttachmentColumn)[keyof typeof AttachmentColumn];
