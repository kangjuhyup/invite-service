import { LetterCategory, LetterCategoryCode } from "@util/category";
import { Transform } from "class-transformer";
import { IsDefined, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class AddLetterRequest {
    @IsDefined()
    @IsString()
    @IsIn(Object.values(LetterCategoryCode))
    category : LetterCategoryCode

    @IsDefined()
    @IsString()
    @MaxLength(20)
    title : string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    body : string;
}