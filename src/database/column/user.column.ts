export const UserColumn = {
  table: 'tb_vm_user',
  userId: 'user_id',
  nickName : 'nc_nm',
  phone : 'mpno',
  password : 'pwd'
} as const;

export type UserColumn = (typeof UserColumn)[keyof typeof UserColumn];
