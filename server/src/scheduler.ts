import cron from 'node-cron';
import { logger } from './logger';

const schedule = process.env.SCHEDULE ?? '5 7 * * *';
export const scheduleJob = (fn: () => Promise<any>) => {
  cron.schedule(schedule, async () => {
    logger.info(`executing job ${schedule} at ${new Date()}`);
    await fn();
    logger.info('job completed');
  });
};
