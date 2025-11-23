
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './src/generated/client';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('Starting debug script');
try {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
  console.log('Adapter created');
  const client = new PrismaClient({ adapter });
  console.log('Client created');
  
  // Try to connect
  // client.$connect().then(() => console.log('Connected')).catch(e => console.error('Connect error', e));
} catch (e) {
  console.error('Error:', e);
}
