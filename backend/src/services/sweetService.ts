import { Prisma } from '@prisma/client';
import prisma from '../prisma';

export type SweetInput = {
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export async function createSweet(input: SweetInput) {
  return prisma.sweet.create({
    data: {
      name: input.name,
      category: input.category,
      price: new Prisma.Decimal(input.price),
      quantity: input.quantity,
    },
  });
}

export async function listSweets() {
  return prisma.sweet.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function searchSweets(filters: {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  return prisma.sweet.findMany({
    where: {
      name: filters.name ? { contains: filters.name } : undefined,
      category: filters.category ? { equals: filters.category } : undefined,
      price: filters.minPrice || filters.maxPrice ? {
        gte: filters.minPrice !== undefined ? new Prisma.Decimal(filters.minPrice) : undefined,
        lte: filters.maxPrice !== undefined ? new Prisma.Decimal(filters.maxPrice) : undefined,
      } : undefined,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateSweet(id: number, data: Partial<SweetInput>) {
  return prisma.sweet.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      price: data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
      quantity: data.quantity,
    },
  });
}

export async function deleteSweet(id: number) {
  return prisma.sweet.delete({ where: { id } });
}

export async function purchaseSweet(id: number) {
  const sweet = await prisma.sweet.findUnique({ where: { id } });
  if (!sweet) {
    throw new Error('Sweet not found');
  }
  if (sweet.quantity <= 0) {
    throw new Error('Out of stock');
  }
  return prisma.sweet.update({ where: { id }, data: { quantity: sweet.quantity - 1 } });
}

export async function restockSweet(id: number, amount: number) {
  const sweet = await prisma.sweet.findUnique({ where: { id } });
  if (!sweet) {
    throw new Error('Sweet not found');
  }
  if (amount <= 0) {
    throw new Error('Restock amount must be positive');
  }
  return prisma.sweet.update({ where: { id }, data: { quantity: sweet.quantity + amount } });
}
