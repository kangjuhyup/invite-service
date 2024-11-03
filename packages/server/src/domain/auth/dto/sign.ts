import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignRequest {
  @ApiProperty({ description: '휴대폰 번호', example: '01012341234' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ description: '패스워드' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
