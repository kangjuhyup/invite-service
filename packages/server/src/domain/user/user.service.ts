import { UserEntity } from '@app/database/entity/user';
import { UserRepository } from '@app/database/repository/user';
import { randomString } from '@app/util/random';
import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(param: {
    email?: string;
    userId?: string;
  }): Promise<UserEntity> {
    const { email, userId } = param;
    const user = email
      ? await this.userRepository.selectUserFromEmail({ email })
      : userId
        ? await this.userRepository.selectUserFromId({ userId })
        : undefined;
    if (!user) throw new UnauthorizedException('존재하지 않는 회원입니다.');
    return user;
  }

  async validateRefresh(userId: string, refreshToken: string) {
    const user = await this.getUser({ userId });
    if (user.refreshToken !== refreshToken)
      throw new UnauthorizedException('RefreshToken이 유효하지 않습니다.');
    return user;
  }

  async saveUser(email: string, pwd: string) {
    await this.userRepository.insertUser({
      user: { nickName: randomString(), email, password: pwd },
      creator: UserService.name,
    });

    return await this.getUser({ email });
  }

  async updateRefresh(userId: string, refreshToken: string) {
    await this.userRepository.updateUser({
      userId,
      refreshToken,
      updator: UserService.name,
    });
  }
}
