import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignRequest {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
