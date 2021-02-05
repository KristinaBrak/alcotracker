import { isDebug } from './env.utils';
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  enabled: process.env.DEBUG?.toUpperCase() === 'TRUE',
});

export const debug = (...args: any[]) => {
  if (isDebug()) {
    console.debug(`[DEBUG] ${args}`);
  }
};
