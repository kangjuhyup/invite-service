import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignRequest {
  @ApiProperty({ description: '휴대폰 번호', example: '01012341234' })
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phone: string;

  @ApiProperty({ description: '패스워드' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class GoogleSignRequest extends SignRequest{
  @IsNotEmpty()
  @IsEmail()
  mail : string;
}