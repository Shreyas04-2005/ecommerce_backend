import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = 'admin@gmail.com';

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) return;

  const hashedPassword = await bcrypt.hash('admin@123', 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());