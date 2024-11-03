import { UserEntity } from 'packages/server/src/database/entity/user';
import { DefaultParameter } from './default';
export declare class SelectUser extends DefaultParameter {
    userId: string;
    phone: string;
}
export declare class InsertUser extends DefaultParameter {
    user: Pick<UserEntity, 'nickName' | 'phone' | 'password'>;
    creator: string;
}
