/**
 * Authentication route protection - ISOMORPHIC
 * Server function for route-level auth checks
 * Safe to import from client-side code
 */

import { createServerFn } from '@tanstack/react-start'

/**
 * Check if user is authenticated and return user data
 *
 * Usage in route beforeLoad:
 * ```ts
 * import { checkRouteAuth } from '@/lib/auth-check'
 *
 * beforeLoad: async () => {
 *   const user =await checkRouteAuth()
 *   if (!user) throw redirect({ to: '/login' })
 * }
 * ```
 */
export const checkRouteAuth = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Dynamic import to avoid static analysis issues with .server.ts files
    const { getCurrentSession } = await import('@/lib/sessions.server')
    const { user } = await getCurrentSession()
    return user
  },
)
