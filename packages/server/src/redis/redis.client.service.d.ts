import Redis from 'ioredis';
export declare class RedisClientService {
    private readonly redisClient;
    private readonly project;
    constructor(redisClient: Redis, project: string);
    set(key: string, value: string | number | Object, expireInSeconds?: number): Promise<void>;
    get<T>(key: string): Promise<T>;
    delete(key: string): Promise<number>;
    has(key: string): Promise<boolean>;
    generateKey(service: string, key: string): string;
}
