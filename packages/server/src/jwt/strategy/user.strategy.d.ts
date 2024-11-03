import { Strategy } from 'passport-jwt';
import { UserService } from 'packages/server/src/domain/user/user.service';
import { User } from 'packages/server/src/jwt/user';
declare const UserStrategy_base: new (...args: any[]) => Strategy;
export declare class UserStrategy extends UserStrategy_base {
    private userService;
    private secret;
    constructor(userService: UserService, secret: string);
    validate(payload: User): Promise<any>;
}
export {};
