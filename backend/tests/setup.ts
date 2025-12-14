import { execSync } from 'child_process';
import prisma from '../src/prisma';

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';

beforeAll(() => {
  // Ensure test database schema is applied before running tests
  execSync('npx prisma migrate deploy --schema prisma/schema.prisma', { stdio: 'inherit' });
});

beforeEach(async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.sweet.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
