// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // verbose: true,
  automock: true,
  rootDir: './src',
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest', '^.+\\.js?$': 'babel-jest' },
  setupFiles: ['dotenv/config'],
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules', 'src'],
};
export default config;
