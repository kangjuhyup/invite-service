import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { LetterCategory } from "src/domain/util/category";

class LetterPageItem {
    @ApiProperty({
        description : '초대장 ID',
        example : 1
    })
    @IsNotEmpty()
    @IsNumber()
    id : number;

    @ApiProperty({
        description : '초대장 제목',
        example : '생일파티 초대'
    })
    @IsNotEmpty()
    @IsString()
    title : string;

    @ApiProperty({
        description: '카테고리',
        example: LetterCategory.ANNIVERSARY,
        enum:  Object.values(LetterCategory)
    })
    @IsNotEmpty()
    category: LetterCategory;
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
        type: [LetterPageItem]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LetterPageItem)
    items: LetterPageItem[];
}
