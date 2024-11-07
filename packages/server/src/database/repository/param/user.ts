import { UserEntity } from '@app/database/entity/user';
import { DefaultParameter } from './default';

export class SelectUser extends DefaultParameter {
  userId: string;
  phone: string;
}

export class InsertUser extends DefaultParameter {
  user: Pick<UserEntity, 'nickName' | 'phone' | 'password' | 'refreshToken'>;
  creator: string;
}

export class UpdateUser extends DefaultParameter {
  userId: string;
  refreshToken?: string;
  updator: string;
}
