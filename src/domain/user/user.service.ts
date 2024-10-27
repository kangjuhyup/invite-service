import { UserRepository } from '@database/repository/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomString } from '@util/random';
@Injectable()
export class UserService {
 
  constructor(
    private readonly userRepository : UserRepository
  ) {}

  async getUser(phone: string) {
    const user = await this.userRepository.selectUserFromPhone({phone});
    if (!user) throw new UnauthorizedException('존재하지 않는 회원입니다.');
    return user;
  }

  async saveUser(phone: string, pwd: string) {
    await this.userRepository.insertUser({
      user : {nickName : randomString(),
      phone,
      password : pwd}
    })

    return await this.getUser(phone);
  }
}
