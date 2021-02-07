import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { exit } from 'process';
import { createConnection } from 'typeorm';
import { logger } from './logger';
import { scheduleJob } from './scheduler';
import { executeStoreRunner } from './service/storeRunner/storeRunner';

createConnection()
  .then(async connection => {
    await connection.runMigrations();
    scheduleJob(executeStoreRunner);
  })
  .catch(error => {
    logger.error(error);
    exit(1);
  });
