import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyCodePayload {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}