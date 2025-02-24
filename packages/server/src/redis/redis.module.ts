import { DynamicModule, Module, Provider } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { RedisClientService } from './redis.client.service';

const REDIS_CLIENT = 'REDIS_CLIENT';

interface RedisModuleAsyncOptions {
  project: string;
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => RedisOptions | Promise<RedisOptions>;
  isGlobal?: boolean;
}

@Module({})
export class RedisClientModule {
  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const redisProvider: Provider = {
      provide: REDIS_CLIENT,
      useFactory: async (...args: any[]) => {
        const redisOptions = await options.useFactory(...args);
        console.log('Redis Connection Options:', {
          host: redisOptions.host,
          port: redisOptions.port,
          envHost: process.env.REDIS_HOST,
          envPort: process.env.REDIS_PORT
        });
        const redisClient = new Redis(redisOptions.port, redisOptions.host, {
          password: redisOptions.password?.trim() || undefined,
          retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          maxRetriesPerRequest: 1,
          enableReadyCheck: true,
          lazyConnect: false
        });

        // 연결 이벤트 핸들링
        redisClient.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
          console.log('Redis Client Connected to:', redisOptions.host);
        });

        return redisClient
      },
      inject: options.inject || [], // 의존성 주입 설정
    };

    return {
      module: RedisClientModule,
      imports: options.imports || [],
      providers: [
        redisProvider, // REDIS_CLIENT 토큰을 제공하는 프로바이더
        {
          provide: RedisClientService,
          useFactory: (redis: Redis) => {
            console.log('✅ RedisClientService received Redis instance:', redis.options);
            return new RedisClientService(redis, options.project);
          }, // Redis 인스턴스를 주입받는 RedisClientService 생성
          inject: [REDIS_CLIENT], // REDIS_CLIENT로부터 Redis 인스턴스 주입
        },
      ],
      exports: [RedisClientService],
      global: options.isGlobal || false,
    };
  }
}
