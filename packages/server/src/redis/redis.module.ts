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
        console.log('RedisClientModule Set RedisProvider');
        const redisOptions = await options.useFactory(...args);
        console.log('redisOptions : ' ,redisOptions);
        return new Redis({
          port : redisOptions.port,
          host : redisOptions.host,
          password : redisOptions.password?.trim() ? redisOptions.password : undefined,
          lookup: (hostname, options, callback) => {
            dns.lookup(hostname, { family: 4, all: false }, (err, address, family) => {
              console.log(`🔍 Custom DNS Lookup: ${hostname} -> ${address} (IPv${family})`);
              callback(err, address, family);
            });
          },
        }); // Redis 인스턴스 생성
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
