export const UserColumn = {
  table: 'tb_vm_user',
  userId: 'user_id',
} as const;

export type UserColumn = (typeof UserColumn)[keyof typeof UserColumn];
