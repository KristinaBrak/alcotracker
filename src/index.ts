import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { exit } from 'process';
import { createConnection, getConnectionOptions } from 'typeorm';
import { logger } from './logger';
import { scheduleJob } from './scheduler';
import { executeStoreRunner } from './service/storeRunner/storeRunner';
import { dbName } from './consts';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';

const PORT = process.env.PORT || 4000;

(async () => {
  logger.info('Starting alcotracker');
  const connection = await getConnectionOptions(dbName).then(options =>
    createConnection({ ...options, name: 'default' }),
  );
  logger.info('connected to database');
  await connection.runMigrations();
  logger.info('migrations completed');

  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.resolver.{ts,js}'],
  });
  scheduleJob(executeStoreRunner);
  const server = new ApolloServer({ schema });

  server.listen(PORT).then(({ url }) => {
    logger.info(`Server is ready at ${url}`);
  });
  exit(0);
})().catch(error => {
  logger.error(error);
  console.error(error.stack);
  exit(1);
});
