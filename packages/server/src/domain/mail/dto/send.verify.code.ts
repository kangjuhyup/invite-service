import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendVerifyCodePayload {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}