export declare const UserColumn: {
    readonly table: "tb_vm_user";
    readonly userId: "user_id";
    readonly nickName: "nc_nm";
    readonly phone: "mpno";
    readonly password: "pwd";
};
export type UserColumn = (typeof UserColumn)[keyof typeof UserColumn];
