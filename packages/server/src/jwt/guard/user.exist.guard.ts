import { UserRepository } from "@app/database/repository/user";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

/**
 * 유저가 존재하지 않을 경우에만 작동하는 가드
 */
@Injectable()
export class UserNotExistGuard implements CanActivate {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { email } = request.query;

        if (!email) {
            throw new UnauthorizedException('이메일이 필요합니다.');
        }

        const user = await this.userRepository.selectUserFromEmail({ email });

        // 유저가 없을 때만 true 반환
        return !user;
    }
}

/**
 * 유저가 존재하는 경우에만 작동하는 가드
 */
@Injectable()
export class UserExistGuard implements CanActivate {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { email } = request.query;

        if (!email) {
            throw new UnauthorizedException('이메일이 필요합니다.');
        }

        const user = await this.userRepository.selectUserFromEmail({ email });

        if(user) {
            return true;
        } else {
            return false;
        }
    }
}