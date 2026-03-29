import { createServerFn } from '@tanstack/react-start'
import { and, eq, ne } from 'drizzle-orm'
import { getCurrentSession } from '@/lib/session-server'
import { db } from '@/db'
import { fcmTokens } from '@/db/fcmTokens'
import { errors } from '@/lib/errors'

export const registerFCMToken = createServerFn({
  method: 'POST',
})
  .inputValidator((v) => {
    if (typeof v === 'object' && v !== null && 'token' in v) {
      return { token: String(v.token) }
    }
    throw new Error('Invalid input')
  })
  .handler(async ({ data: { token } }) => {
    const { user } = await getCurrentSession()

    if (!user) {
      console.warn('[FCM] registerFCMToken rejected: unauthorized request')
      throw errors.unauthorized()
    }

    if (!token) {
      console.warn('[FCM] registerFCMToken rejected: empty token payload')
      throw errors.badRequest('FCM token required')
    }

    console.info(`[FCM] Persisting token for user ${user.id}`)

    const alreadyBound = await db
      .select({ token: fcmTokens.token })
      .from(fcmTokens)
      .where(and(eq(fcmTokens.userId, user.id), eq(fcmTokens.token, token)))

    if (alreadyBound.length > 0) {
      console.info(`[FCM] Token already mapped for user ${user.id}`)
      return { success: true }
    }

    // Upsert by token so a token can move between users safely.
    await db
      .insert(fcmTokens)
      .values({
        userId: user.id,
        token,
      })
      .onConflictDoUpdate({
        target: fcmTokens.token,
        set: {
          userId: user.id,
        },
      })

    // Keep one active token per user by removing stale rows for the same user.
    await db
      .delete(fcmTokens)
      .where(and(eq(fcmTokens.userId, user.id), ne(fcmTokens.token, token)))

    const persisted = await db
      .select({ token: fcmTokens.token })
      .from(fcmTokens)
      .where(and(eq(fcmTokens.userId, user.id), eq(fcmTokens.token, token)))

    if (persisted.length === 0) {
      throw new Error('FCM token persistence failed after upsert')
    }

    console.info(`[FCM] Token persisted and normalized for user ${user.id}`)

    return { success: true }
  })
