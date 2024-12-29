import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignRequest {
  @ApiProperty({ description: '이메일 주소', example: 'fog0510@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '패스워드' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
