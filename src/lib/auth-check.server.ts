/**
 * Authentication route protection - SERVER IMPLEMENTATION
 * Contains the handler logic for auth checks
 */

import '@tanstack/react-start/server-only'

import { getCurrentSession } from '@/lib/sessions.server'

/**
 * Internal server-side auth check implementation
 * Used by the server function handler
 */
export const authCheckHandler = async () => {
  const { user } = await getCurrentSession()
  return user
}
