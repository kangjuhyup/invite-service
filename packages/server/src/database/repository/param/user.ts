import { UserEntity } from '@app/database/entity/user';
import { DefaultParameter } from './default';

export class SelectUser extends DefaultParameter {
  userId: string;
  phone?: string;
  email: string;
}

export class InsertUser extends DefaultParameter {
  user: Pick<UserEntity, 'nickName' | 'email' | 'password' | 'refreshToken'>;
  creator: string;
}

export class UpdateUser extends DefaultParameter {
  userId: string;
  refreshToken?: string;
  updator: string;
}
