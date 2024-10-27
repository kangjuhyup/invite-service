import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomString } from '@util/random';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserService {
  private readonly mock = [
    {
      userId: 'ddab41a0-0fc7-4602-927b-40a681021ace',
      nickName: 'tester',
      phone: '01012341234',
      pwd: '97385f8ee138c77ecbd815a3dda29bc40ecbfc16945d5bb9d5e65480aca3c9bc',
    },
  ];

  async getUser(phone: string) {
    const user = this.mock.find((u) => u.phone === phone);
    if (!user) throw new UnauthorizedException('존재하지 않는 회원입니다.');
    return user;
  }

  async saveUser(phone: string, pwd: string) {
    const newUser = {
      userId: uuidv4(),
      nickName: randomString(),
      phone,
      pwd,
    };
    this.mock.push();
    return newUser;
  }
}
