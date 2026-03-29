/**
 * Session management - ISOMORPHIC
 * Client-side server function to get session data
 *
 * Server-only logic moved to session-server.ts
 */

import { createServerFn } from '@tanstack/react-start'
import { getCurrentSession } from '@/lib/session-server'

/**
 * Server function for getting session from client
 * Automatically handles auth middleware and caching
 *
 * Usage in components:
 * ```ts
 * const session = await getSessionUser()
 * if (!session) navigate({ to: '/login' })
 * ```
 */
export const getSessionUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { user } = await getCurrentSession()
    return user
  },
)
