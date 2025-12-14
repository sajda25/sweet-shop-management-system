import { Router } from 'express';
import { z } from 'zod';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  createSweet,
  deleteSweet,
  listSweets,
  purchaseSweet,
  restockSweet,
  searchSweets,
  updateSweet,
} from '../services/sweetService';

const router = Router();

const sweetSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
});

const updateSchema = sweetSchema.partial();

router.use(authenticate);

router.post('/', async (req, res) => {
  const parsed = sweetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
  }
  try {
    const sweet = await createSweet(parsed.data);
    return res.status(201).json(serializeSweet(sweet));
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Failed to create sweet' });
  }
});

router.get('/', async (_req, res) => {
  const sweets = await listSweets();
  return res.json(sweets.map(serializeSweet));
});

router.get('/search', async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  const parsedMin = minPrice ? Number(minPrice) : undefined;
  const parsedMax = maxPrice ? Number(maxPrice) : undefined;
  const sweets = await searchSweets({
    name: name as string | undefined,
    category: category as string | undefined,
    minPrice: Number.isFinite(parsedMin) ? parsedMin : undefined,
    maxPrice: Number.isFinite(parsedMax) ? parsedMax : undefined,
  });
  return res.json(sweets.map(serializeSweet));
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
  }
  try {
    const sweet = await updateSweet(id, parsed.data);
    return res.json(serializeSweet(sweet));
  } catch (err: any) {
    return res.status(404).json({ message: err.message || 'Sweet not found' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const sweet = await deleteSweet(id);
    return res.json(serializeSweet(sweet));
  } catch (err: any) {
    return res.status(404).json({ message: err.message || 'Sweet not found' });
  }
});

router.post('/:id/purchase', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
  try {
    const sweet = await purchaseSweet(id);
    return res.json(serializeSweet(sweet));
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Purchase failed' });
  }
});

router.post('/:id/restock', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
  const amount = Number(req.body?.amount ?? 0);
  if (!Number.isFinite(amount)) return res.status(400).json({ message: 'Invalid amount' });
  try {
    const sweet = await restockSweet(id, amount);
    return res.json(serializeSweet(sweet));
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Restock failed' });
  }
});

function serializeSweet(sweet: any) {
  return {
    id: sweet.id,
    name: sweet.name,
    category: sweet.category,
    price: Number(sweet.price),
    quantity: sweet.quantity,
    createdAt: sweet.createdAt,
    updatedAt: sweet.updatedAt,
  };
}

export default router;
