/**
 * Session management - SERVER ONLY
 * Contains server-side session retrieval logic
 */

import '@tanstack/react-start/server-only'

import { cache } from 'react'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/better-auth-server'

/**
 * Get current session (server-side only)
 * Uses React.cache() for per-request deduplication (TanStack Start best practice)
 *
 * Automatically memoized per request - multiple calls return cached result
 * Cache is invalidated at start of next request cycle
 *
 * Usage in server functions:
 * ```ts
 * const { user, session } = await getCurrentSession()
 * if (!user) throw errors.unauthorized()
 * ```
 */
export const getCurrentSession = cache(async () => {
  try {
    const headers = getRequestHeaders()

    const sessionData = await auth.api.getSession({
      headers: headers,
    })

    return {
      user: sessionData?.user || null,
      session: sessionData?.session || null,
    }
  } catch (error) {
    return { user: null, session: null }
  }
})
