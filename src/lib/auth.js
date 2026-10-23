import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'teamsync-ai-secure-college-session-secret-key-2026-production-ready'
);

const COOKIE_NAME = 'teamsync_session';

/**
 * Hash plaintext password using bcrypt
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate signed JWT token
 */
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Helper to get Next.js cookies safely in runtime
 */
async function getCookieStore() {
  try {
    const { cookies } = await import('next/headers');
    return await cookies();
  } catch {
    return null;
  }
}

/**
 * Get current session from cookies
 */
export async function getSession() {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return null;
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token) {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return;
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Remove session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return;
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Require authenticated session
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

/**
 * Require specific role or permission
 */
export async function requireRole(allowedRoles = []) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}
