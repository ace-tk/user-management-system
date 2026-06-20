import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const pool = mariadb.createPool(process.env.DATABASE_URL!);
  const adapter = new PrismaMariaDb(pool);
  return new PrismaClient({ adapter });
};

const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
