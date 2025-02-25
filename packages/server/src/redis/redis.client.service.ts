import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from '@redis/client';

@Injectable()
export class RedisClientService implements OnModuleDestroy {
  constructor(
    private readonly redisClient: RedisClientType,
    private readonly project: string,
  ) {
    console.log('✅ RedisClientService received Redis instance');
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async set(
    key: string,
    value: string | number | Object,
    expireInSeconds?: number,
  ): Promise<void> {
    const serializedValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    if (expireInSeconds) {
      await this.redisClient.set(key, serializedValue, {
        EX: expireInSeconds
      });
    } else {
      await this.redisClient.set(key, serializedValue);
    }
  }

  async get<T>(key: string): Promise<T> {
    const result = await this.redisClient.get(key);
    if (!result) return null;

    try {
      return JSON.parse(result) as T;
    } catch (e) {
      return result as T;
    }
  }

  async delete(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async has(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  generateKey(service: string, key: string) {
    return `${this.project}::${service}::${key}`;
  }
}
