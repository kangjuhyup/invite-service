import { DynamicModule, Module, Provider } from '@nestjs/common';
import { createClient, RedisClientOptions } from '@redis/client';
import { RedisClientService } from './redis.client.service';

const REDIS_CLIENT = 'REDIS_CLIENT';

interface RedisModuleAsyncOptions {
  project: string;
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => RedisClientOptions | Promise<RedisClientOptions>;
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
          host: redisOptions.url,
          envHost: process.env.REDIS_HOST,
          envPort: process.env.REDIS_PORT
        });

        // Redis standalone 모드 연결
        const redisClient = createClient({
          url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
          database: 0
        });

        // 연결 이벤트 핸들링
        redisClient.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
          console.log('Redis Client Connected');
        });

        await redisClient.connect();
        return redisClient;
      },
      inject: options.inject || [],
    };

    return {
      module: RedisClientModule,
      imports: options.imports || [],
      providers: [
        redisProvider,
        {
          provide: RedisClientService,
          useFactory: (redis) => {
            return new RedisClientService(redis, options.project);
          },
          inject: [REDIS_CLIENT],
        },
      ],
      exports: [RedisClientService],
      global: options.isGlobal || false,
    };
  }
}
