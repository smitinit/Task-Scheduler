import { getCookie, setResponseHeader } from '@tanstack/react-start/server'
import { lucia } from '@/lib/auth'

export async function getCurrentSession() {
  const sessionId = getCookie(lucia.sessionCookieName)

  if (!sessionId) return { user: null, session: null }

  const result = await lucia.validateSession(sessionId)

  if (result.session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(result.session.id)
    setResponseHeader('Set-Cookie', sessionCookie.serialize())
  }

  return result
}
