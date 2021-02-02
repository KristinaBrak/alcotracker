import Redis from "ioredis";
import { exit } from "process";
import { CACHE_DURATION } from "./consts";
import { isDebug } from "./env.utils";
import { FetchData } from "./types";

export const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

export const cache = new Redis(REDIS_PORT).on("error", () => {
  console.error("[ERROR] Redis is not running!");
  exit(2);
});

export const withCache = <T>(fn: FetchData<T>) => async (
  key: string,
  ...args: any[]
): Promise<T> => {
  const cachedItems = await cache.get(key);
  if (cachedItems) {
    if (isDebug()) {
      console.debug("[DEBUG] cache hit");
    }

    return JSON.parse(cachedItems);
  }

  return fn(key, ...args).then(async (data) => {
    if (isDebug()) {
      console.debug("[DEBUG] writting to cache");
    }

    await cache.setex(key, CACHE_DURATION, JSON.stringify(data));
    return data;
  });
};
