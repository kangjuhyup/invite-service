import { UserEntity } from 'packages/server/src/database/entity/user';
import { UserRepository } from 'packages/server/src/database/repository/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomString } from 'packages/server/src/util/random';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(param: {
    phone?: string;
    userId?: string;
  }): Promise<UserEntity> {
    const { phone, userId } = param;
    const user = phone
      ? await this.userRepository.selectUserFromPhone({ phone })
      : userId
        ? await this.userRepository.selectUserFromId({ userId })
        : undefined;
    if (!user) throw new UnauthorizedException('존재하지 않는 회원입니다.');
    return user;
  }

  async saveUser(phone: string, pwd: string) {
    await this.userRepository.insertUser({
      user: { nickName: randomString(), phone, password: pwd },
      creator: UserService.name,
    });

    return await this.getUser({ phone });
  }
}