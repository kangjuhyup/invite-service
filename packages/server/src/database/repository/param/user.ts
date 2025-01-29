import { UserEntity } from '@app/database/entity/user/user';
import { DefaultParameter } from './default';
import { UserAttachmentEntity } from '@app/database/entity/user/user.attachment';

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
  nickName?: string;
  introduce?: string;
  refreshToken?: string;
  updator: string;
}

export class UpsertUserProfileImage extends DefaultParameter {
  userAttachment: UserAttachmentEntity;
}
