import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  await prisma.sweet.deleteMany();

  const sweets = [
    { name: 'Berry Bliss Tart', category: 'Tarts', price: 4.5, quantity: 12 },
    { name: 'Caramel Crunch Bar', category: 'Bars', price: 3.75, quantity: 20 },
    { name: 'Lemon Zest Cheesecake', category: 'Cakes', price: 5.25, quantity: 8 },
    { name: 'Pistachio Macaron', category: 'Macarons', price: 2.1, quantity: 30 },
    { name: 'Sea Salt Brownie', category: 'Brownies', price: 3.25, quantity: 18 },
  ];

  await prisma.sweet.createMany({ data: sweets });

  console.log('Seed complete. Admin: admin@example.com / admin123');
  console.log(`Inserted sweets: ${sweets.length}`);
  console.log(`Admin id: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
