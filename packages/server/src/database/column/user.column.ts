export const UserColumn = {
  table: 'tb_vm_user',
  userId: 'user_id',
  nickName: 'nc_nm',
  mail: 'mail',
  phone: 'mpno',
  password: 'pwd',
  refreshToken: 'rfh_tk',
} as const;

export type UserColumn = (typeof UserColumn)[keyof typeof UserColumn];
