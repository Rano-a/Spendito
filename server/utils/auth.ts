import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'

interface SessionData {
  userId?: string
}

function sessionConfig() {
  const config = useRuntimeConfig()
  const password = config.sessionSecret as string
  if (!password) {
    throw createError({ statusCode: 500, statusMessage: 'SESSION_SECRET is not configured' })
  }
  return {
    password,
    name: 'budgeto-session',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    cookie: {
      // h3 defaults the session cookie to `secure: true`, which browsers
      // silently refuse to send over plain HTTP except on `localhost` —
      // this app is mobile-first and gets tested over LAN (http://<ip>:3000),
      // so forcing `secure` in dev would break login there without any error.
      secure: !import.meta.dev,
      sameSite: 'lax' as const
    }
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// A real bcrypt hash of a password nobody will ever type, used to keep the
// login timing the same whether or not the email exists — otherwise a
// nonexistent email returns near-instantly (no hash to compare against)
// while a real one takes ~50-100ms for bcrypt.compare, letting an attacker
// enumerate registered emails purely from response time.
export const DUMMY_HASH = '$2b$10$o5a6K4fSBWE15OsfnALPAeOPDq62IPZKGFcNeRlqITOOJi2TtpN1e'

export function getUserSession(event: H3Event) {
  return useSession<SessionData>(event, sessionConfig())
}

export async function requireUserId(event: H3Event): Promise<string> {
  const session = await getUserSession(event)
  const userId = session.data.userId
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }
  return userId
}
