import { LetterEntity } from '@app/database/entity/letter';
import { LetterAttachmentCode } from '@app/util/attachment';
import { LetterCategoryCode } from '@app/util/category';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
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

  static of(
    id: number,
    title: string,
    category: LetterCategoryCode,
    thumbnail: string,
  ) {
    const item = new LetterPageItem();
    item.id = id;
    item.title = title;
    item.category = category;
    item.thumbnail = thumbnail;
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
        l.letterId,
        l.title,
        l.letterCategoryCode,
        l.letterAttachment.find(
          (la) => la.attachmentCode === LetterAttachmentCode.THUMBNAIL,
        )?.attachment.attachmentPath,
      ),
    );
    return response;
  }
}
