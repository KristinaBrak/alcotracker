import cron from 'node-cron';
import { logger } from './logger';

const schedule = process.env.SCHEDULE ?? '* 9 * * *';
export const scheduleJob = (fn: () => Promise<any>) => {
  logger.info(`scheduling job ${schedule} at ${new Date()}`);
  cron.schedule(schedule, async () => {
    logger.info(`executing job ${schedule} at ${new Date()}`);
    await fn();
  });
};
