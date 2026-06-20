import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: string;
}

const getConfig = (): Config => {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Validate required variables
  if (!process.env.PORT) {
    console.warn('⚠️  PORT environment variable is not set. Defaulting to 3000.');
  }

  // Example of a hard validation:
  // if (!process.env.DATABASE_URL) {
  //   throw new Error('❌ DATABASE_URL environment variable is required.');
  // }

  return {
    PORT,
    NODE_ENV,
  };
};

export const env = getConfig();
