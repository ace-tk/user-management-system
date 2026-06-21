import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Load environment variables before tests run
  setupFiles: ['dotenv/config'],
  // Run setup/teardown hooks
  setupFilesAfterEnv: [],
  verbose: true,
};

export default config;
