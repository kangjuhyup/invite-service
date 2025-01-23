import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentRequest {
  @ApiProperty({
    description: '댓글 작성자 닉네임',
    example: '홍길동',
    minLength: 1,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  editor: string;

  @ApiProperty({
    description: '댓글 내용',
    example: '축하드립니다!',
    minLength: 5,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  content: string;

  @ApiProperty({
    description: '댓글 삭제시 사용할 비밀번호',
    example: 'password123',
    minLength: 1,
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  password: string;
}
