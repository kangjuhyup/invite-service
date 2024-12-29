import { LetterEntity } from '@app/database/entity/letter';
import { LetterCommentEntity } from '@app/database/entity/letter.comment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LetterAttachmentCode } from '@app/util/attachment';

export class Letter {
  @ApiProperty({
    description: '이미지 경로',
    example: 'https://example.com/img.png',
  })
  @IsNotEmpty()
  @IsString()
  path: string;

  @ApiProperty({
    description: '이미지 너비',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @ApiProperty({
    description: '이미지 높이',
    example: 80,
  })
  @IsNotEmpty()
  @IsNumber()
  height: number;

  static of(letter: LetterEntity) {
    const response = new Letter();
    const attachment = letter.letterAttachment.find(
      (la) => la.attachmentCode === LetterAttachmentCode.LETTER,
    );
    response.path = attachment.attachment.attachmentPath;
    response.width = attachment.width;
    response.height = attachment.height;
    return response;
  }
}

export class Comment {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  body: string;

  static of(comment: LetterCommentEntity) {
    const response = new Comment();
    response.name = comment.editor;
    response.body = comment.body;
    return response;
  }
}

export class GetLetterResponse {
  @ApiProperty({
    description: '초대장 ID',
  })
  @IsNotEmpty()
  @IsNumber()
  letterId: number;
  @ApiProperty({
    description: '배경 이미지 정보',
    type: Letter,
  })
  @ValidateNested()
  @Type(() => Letter)
  @IsNotEmpty()
  letter: Letter;

  @ApiProperty({
    description: '댓글 목록',
    type: Array<Comment>,
  })
  @ValidateNested({ each: true })
  @Type(() => Comment)
  @IsNotEmpty()
  comments: Array<Comment>;

  static of(letter: LetterEntity) {
    const response = new GetLetterResponse();
    (response.letterId = letter.letterId),
      (response.letter = Letter.of(letter)),
      (response.comments = letter.letterComment.map((lc) => Comment.of(lc)));
    return response;
  }
}
