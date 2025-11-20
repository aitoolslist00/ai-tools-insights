import * as jose from 'jose';
import bcrypt from 'bcrypt';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_dev_secret_change_in_production'
);

export interface User {
  id: number;
  username: string;
}

export async function verifyCredentials(username: string, password: string): Promise<User | null> {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = await stmt.get(username) as any;

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    username: user.username
  };
}

export async function generateToken(user: User): Promise<string> {
  const token = await new jose.SignJWT({ userId: user.id, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return {
      id: payload.userId as number,
      username: payload.username as string
    };
  } catch {
    return null;
  }
}

export function getAuthCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, v.join('=')];
    })
  );

  return cookies['auth-token'] || null;
}

export async function requireAuth(request: Request): Promise<User> {
  const token = getAuthCookie(request);
  if (!token) throw new Error('Not authenticated');

  const user = await verifyToken(token);
  if (!user) throw new Error('Invalid token');

  return user;
}
