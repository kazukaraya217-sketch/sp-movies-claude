import { cookies } from 'next/headers';
import { verifyAdmin } from './db';

const ADMIN_COOKIE = 'admin_session';

export async function setAuthCookie(username: string) {
  const cookieStore = await cookies();
  // Create a simple session token (in production, use proper JWT)
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  });
  return token;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value;
}

export async function verifyAuth(): Promise<boolean> {
  const token = await getAuthCookie();
  return !!token;
}

export async function login(username: string, password: string): Promise<boolean> {
  if (verifyAdmin(username, password)) {
    await setAuthCookie(username);
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  await removeAuthCookie();
}