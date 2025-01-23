import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileRequest {
  @IsOptional()
  @IsString()
  nickName?: string;
}
