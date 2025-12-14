import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, Role } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization header' });
  }

  const token = header.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: Role };
    req.user = { id: payload.userId, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  return next();
}
