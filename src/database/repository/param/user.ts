import { UserEntity } from '@database/entity/user';
import { DefaultParameter } from './default';

export class SelectUser extends DefaultParameter {
  userId: string;
  phone: string;
}

export class InsertUser extends DefaultParameter {
  user: Pick<UserEntity, 'nickName' | 'phone' | 'password'>;
  creator: string;
}
