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
          // 클러스터 환경 설정
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            const delay = Math.min(times * 100, 3000);
            return delay;
          },
          // 연결 풀 관리
          enableOfflineQueue: true,
          enableReadyCheck: true,
          // 성능 최적화
          enableAutoPipelining: true,
          autoResendUnfulfilledCommands: true,
          // 디버깅
          showFriendlyErrorStack: true,
          // 연결 유지
          keepAlive: 10000,
          noDelay: true,
          connectionName: `invite-api-${process.pid}`
        };

        console.log(`Redis 연결 시도 (PID ${process.pid}):`, {
          host: connectionOptions.host,
          port: connectionOptions.port,
          connectionName: connectionOptions.connectionName
        });
        
        const redisClient = new Redis(connectionOptions);

        // 연결 이벤트 핸들링
        redisClient.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
          console.log('Redis Client Connected to:', redisOptions.host);
        });

        // 명시적 연결 시도
        redisClient.connect().catch(err => {
          console.error('Redis Connection Error:', err);
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
