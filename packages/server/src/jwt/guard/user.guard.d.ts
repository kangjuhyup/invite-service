import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
declare const UserGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class UserGuard extends UserGuard_base {
    private readonly jwtService;
    private logger;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
export {};
