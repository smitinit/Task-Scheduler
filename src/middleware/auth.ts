import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { lucia } from '@/lib/auth'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders()
  const sessionId = lucia.readSessionCookie(headers.get('cookie') ?? '')

  if (!sessionId) throw redirect({ to: '/login' })

  const { session } = await lucia.validateSession(sessionId)

  if (!session) throw redirect({ to: '/login' })

  return next()
})
