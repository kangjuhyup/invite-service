import { LetterEntity } from '@app/database/entity/letter/letter';
import { LetterAttachmentCode } from '@app/util/attachment';
import { LetterCategoryCode } from '@app/util/category';
import { YN, ynToBoolean } from '@app/util/yn';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class LetterPageItem {
  @ApiProperty({
    description: '초대장 ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '초대장 제목',
    example: '생일파티 초대',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description : '초대장 설명',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    description: '카테고리',
    example: LetterCategoryCode.ANNIVERSARY,
    enum: Object.values(LetterCategoryCode),
  })
  @IsNotEmpty()
  @IsIn(Object.values(LetterCategoryCode))
  category: LetterCategoryCode;

  @ApiProperty({
    description: '썸네일 이미지 경로',
    example: 'https://s3.ap-northeast-1.wasabisys.com/thm/00001',
  })
  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @ApiProperty({
    description : '일자'
  })
  @IsOptional()
  @IsString()
  inviteDate? : string;

  @ApiProperty({
    description: '공통 유효성',
    example: YN.N,
  })
  @IsNotEmpty()
  @IsBoolean()
  publicYn: boolean;

  @ApiProperty({
    description: '초대장 비밀번호',
    example: '1234',
  })
  @IsOptional()
  @IsString()
  password?: string;

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

  static of(letter: LetterEntity) {
    const item = new LetterPageItem();
    item.id = letter.letterId;
    item.title = letter.title;
    item.body = letter.body;
    item.category = letter.letterCategoryCode;
    item.inviteDate = letter.inviteDate;
    item.thumbnail = letter.letterAttachment.find(
      (la) => la.attachmentCode === LetterAttachmentCode.THUMBNAIL,
    )?.attachment.attachmentPath;
    item.publicYn = ynToBoolean(letter.publicYn);
    item.password = letter.password;
    item.viewCount = letter.letterTotal.viewCount;
    item.commentCount = letter.letterTotal.commentCount;
    item.attendCount = letter.letterTotal.attendantCount;
    return item;
  }
}

export class GetLetterPageResponse {
  @ApiProperty({
    description: '초대장 총 개수',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: '초대장 정보 목록',
    type: [LetterPageItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LetterPageItem)
  items: LetterPageItem[];

  static of(totalCount: number, letters: LetterEntity[]) {
    const response = new GetLetterPageResponse();
    response.totalCount = totalCount;
    response.items = letters.map((l) =>
      LetterPageItem.of(
        l
      ),
    );
    return response;
  }
}
