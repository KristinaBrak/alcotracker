import cron from 'node-cron';

const schedule = process.env.SCHEDULE ?? '* 9 * * *';
export const scheduleJob = (fn: () => Promise<any>) => {
  cron.schedule(schedule, async () => {
    await fn();
  });
};
