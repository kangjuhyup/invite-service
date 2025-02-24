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
        // Redis 연결 옵션 설정
        const connectionOptions = {
          host: redisOptions.host,
          port: redisOptions.port,
          password: redisOptions.password?.trim(),
          // 기본 연결 설정
          retryStrategy: null,  // 재시도 비활성화
          maxRetriesPerRequest: 1,
          connectTimeout: 5000,
          // 클러스터/센티널 모드 비활성화
          enableOfflineQueue: false,
          lazyConnect: false,
          // 디버깅 설정
          showFriendlyErrorStack: true
        };

        console.log('Redis 연결 시도:', connectionOptions);
        const redisClient = new Redis(connectionOptions);

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
