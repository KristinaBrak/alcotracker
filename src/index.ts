import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { exit } from 'process';
import { createConnection, getConnectionOptions } from 'typeorm';
import { logger } from './logger';
import { scheduleJob } from './scheduler';
import { executeStoreRunner } from './service/storeRunner/storeRunner';
import { dbName } from './consts';

(async () => {
  logger.info('Starting alcotracker');
  const connection = await getConnectionOptions(dbName).then(options =>
    createConnection({ ...options, name: 'default' }),
  );
  logger.info('connected to database');
  await connection.runMigrations();
  logger.info('migrations completed');
  scheduleJob(executeStoreRunner);
})().catch(error => {
  logger.error(error);
  console.error(error.stack);
  exit(1);
});
