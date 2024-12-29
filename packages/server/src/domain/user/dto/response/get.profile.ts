import { UserEntity } from '@app/database/entity/user';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class GetMyProfileResponse {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  nickName?: string;

  static of(user: UserEntity) {
    const response = new GetMyProfileResponse();
    response.id = user.userId;
    response.email = user.email;
    response.nickName = user.nickName;
    return response;
  }
}
