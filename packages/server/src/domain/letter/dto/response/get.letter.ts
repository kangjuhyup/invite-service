import { LetterEntity } from '@app/database/entity/letter/letter';
import { LetterCommentEntity } from '@app/database/entity/letter/letter.comment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LetterAttachmentCode } from '@app/util/attachment';
import { booleanToYN, ynToBoolean } from '@app/util/yn';
import { LetterCategoryCode } from '@app/util/category';

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
    response.width = attachment.attachment.metadata.width;
    response.height = attachment.attachment.metadata.height;
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

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: '공개여부',
  })
  @IsNotEmpty()
  @IsBoolean()
  publicYn: boolean;

  @ApiProperty({
    description: '패스워드(작성자가 조회했을 경우에만 표출)',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: '배경 이미지 정보',
    type: Letter,
  })
  @ValidateNested()
  @Type(() => Letter)
  @IsNotEmpty()
  letter: Letter;

  @ApiProperty({
    description : '일자'
  })
  @IsOptional()
  @IsString()
  inviteDate? : string;

  @ApiProperty({
    description : '조회수'
  })
  viewCount : number;

  @ApiProperty({
    description : '댓글 수'
  })
  commentCount : number;

  @ApiProperty({
    description : '총 참여자 수'
  })
  attendCount : number;

  @ApiProperty({
    description: '댓글 목록',
    type: Array<Comment>,
  })
  @ValidateNested({ each: true })
  @Type(() => Comment)
  @IsNotEmpty()
  comments: Array<Comment>;

  @ApiProperty({
    description : '카테고리'
  })
  @IsNotEmpty()
  @IsIn(Object.values(LetterCategoryCode))
  category: LetterCategoryCode;

  static of(letter: LetterEntity, isRequestedEditor: boolean) {
    const response = new GetLetterResponse();
    response.letterId = letter.letterId;
    response.letter = Letter.of(letter);
    response.comments = letter.letterComment?.map((lc) => Comment.of(lc)) || [];
    response.publicYn = ynToBoolean(letter.publicYn);
    response.password = isRequestedEditor ? letter.password : undefined;
    response.inviteDate = letter.inviteDate;
    response.viewCount = letter.letterTotal.viewCount;
    response.commentCount = letter.letterTotal.commentCount;
    response.attendCount = letter.letterTotal.attendantCount;
    response.category = letter.letterCategoryCode;
    response.userId = letter.userId;
    response.title = letter.title;
    response.body = letter.body;
    return response;
  }
}
