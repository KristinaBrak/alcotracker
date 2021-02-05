import Redis from 'ioredis';
import { exit } from 'process';
import { CACHE_DURATION_SECONDS } from './consts';
import { logger } from './logger';
import { FetchData } from './types';

export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

export const cache = new Redis(REDIS_PORT).on('error', () => {
  logger.error('Redis is not running!');
  exit(2);
});

export const withCache = <T>(fn: FetchData<T>) => async (
  key: string,
  ...args: any[]
): Promise<T> => {
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
