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
        // Redis standalone 모드 연결
        const redisClient = new Redis({
          host: redisOptions.host,
          port: redisOptions.port,
          password: redisOptions.password?.trim() || undefined,
          // 기본 설정
          db: 0,
          maxRetriesPerRequest: 1,
          showFriendlyErrorStack: true
        });

        console.log('Redis 연결 정보:', {
          host: redisOptions.host,
          port: redisOptions.port
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
