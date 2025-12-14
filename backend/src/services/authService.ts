import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '../prisma';
import { Role } from '../types';

// JWT config; secrets come from env in real deployments
const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_TTL = (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'];

// Registers a new user with hashed password; returns user and JWT
export async function registerUser(email: string, password: string, role: Role = 'USER'): Promise<{ user: User; token: string }> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role } });
  const token = createToken(user);
  return { user, token };
}

// Authenticates a user; throws on invalid credentials; returns user and JWT
export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = createToken(user);
  return { user, token };
}

function createToken(user: User) {
  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}
