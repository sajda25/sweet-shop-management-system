import { Request } from 'express';

export type Role = 'USER' | 'ADMIN';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
