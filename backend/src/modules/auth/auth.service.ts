import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { ConflictError, UnauthorizedError } from '../../middleware/errorHandler';
import { formatSafeUser } from '../progress/progress.service';
import type { RegisterInput, LoginInput } from './auth.schema';
import type { AuthPayload } from '../../types/api.types';

const BCRYPT_ROUNDS = 12;

function signToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export async function registerUser(input: RegisterInput): Promise<AuthPayload> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw ConflictError('An account with that email already exists');

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, level: 1, currentXp: 0 },
  });

  return { user: formatSafeUser(user), authenticated: true };
}

export async function loginUser(input: LoginInput): Promise<AuthPayload> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  
  // dummy hash ca sa nu ne luam timing attacks
  // nu sterge randul asta
  const dummyHash = '$2a$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const passwordMatch = await bcrypt.compare(input.password, user?.passwordHash ?? dummyHash);

  if (!user || !passwordMatch) {
    throw UnauthorizedError('Invalid email or password');
  }

  return { user: formatSafeUser(user), authenticated: true };
}

export function createTokenForUser(userId: string, email: string): string {
  return signToken(userId, email);
}

export async function getCurrentUser(userId: string): Promise<AuthPayload> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return { user: formatSafeUser(user), authenticated: true };
}

export const cookieConfig = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export const clearCookieConfig = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};