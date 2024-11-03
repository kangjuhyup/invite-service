import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    signIn(phone: string, pwd: string): Promise<{
        access: string;
    }>;
    signUp(phone: string, pwd: string): Promise<{
        access: string;
    }>;
    private _generateAccessToken;
}
