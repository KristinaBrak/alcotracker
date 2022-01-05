import Redis from 'ioredis';
import { exit } from 'process';
import { CACHE_DURATION_SECONDS } from './consts';
import { logger } from './logger';
import { FetchData } from './types';

const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost:6379';

const cache = new Redis(REDIS_HOST).on('error', error => {
  logger.error(`Redis is not swimming ${error}`);
  exit(2);
});

// export const withCache =
//   <T>(fn: FetchData<T>) =>
//   async (key: string, ...args: any[]): Promise<T> =>
//     fn(key, ...args);

export const withCache =
  <T>(fn: FetchData<T>) =>
  async (key: string, ...args: any[]): Promise<T> => {
    const cachedItems = await cache.get(key);
    if (cachedItems) {
      logger.debug('cache hit', key);

      return JSON.parse(cachedItems);
    }

    return fn(key, ...args).then(async data => {
      logger.debug('writting to cache', key);

      await cache.setex(key, CACHE_DURATION_SECONDS, JSON.stringify(data));
      return data;
    });
  };
