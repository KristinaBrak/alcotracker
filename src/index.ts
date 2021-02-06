import * as dotenv from 'dotenv';
import { exit } from 'process';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { logger } from './logger';
import { executeStoreRunner } from './service/storeRunner/storeRunner';
dotenv.config();

createConnection()
  .then(async connection => {
    await connection.runMigrations();
    await executeStoreRunner();
  })
  .catch(error => {
    logger.error(error);
    exit(1);
  })
  .finally(() => exit(0));
