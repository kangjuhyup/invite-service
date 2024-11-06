import { RedisClientService } from '@app/redis/redis.client.service';
import { randomString } from '@app/util/random';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(private readonly redis: RedisClientService) {}

  async generateSignupSession(phone: string) {
    const session = randomString(10);
    await this.redis.set(
      this.redis.generateKey('AuthFacade', `signup-${phone}`),
      session,
    );
    return session;
  }

  async getSignupSession(phone: string) {
    return await this.redis.get<string>(
      this.redis.generateKey('AuthFacade', `signup-${phone}`),
    );
  }

  async deleteSignupSession(phone: string) {
    await this.redis.delete(
      this.redis.generateKey('AuthFacade', `signup-${phone}`),
    );
  }
  async setSignInSession(userId: string, access: string, refresh: string) {
    return await this.redis.set(
      this.redis.generateKey('AuthFacade', `signin-${userId}`),
      { access, refresh },
    );
  }

  async getSignInSession(userId: string) {
    return await this.redis.get<string>(
      this.redis.generateKey('AuthFacade', `signin-${userId}`),
    );
  }
}
