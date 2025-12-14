import { Router } from 'express';
import { z } from 'zod';
import { loginUser, registerUser } from '../services/authService';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
  }
  try {
    const { user, token } = await registerUser(parsed.data.email, parsed.data.password, parsed.data.role || 'USER');
    return res.status(201).json({ token, user: serializeUser(user) });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
  }
  try {
    const { user, token } = await loginUser(parsed.data.email, parsed.data.password);
    return res.status(200).json({ token, user: serializeUser(user) });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Login failed' });
  }
});

function serializeUser(user: { id: number; email: string; role: string }) {
  return { id: user.id, email: user.email, role: user.role };
}

export default router;
