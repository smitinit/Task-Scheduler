import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { getCurrentSession } from '@/lib/sessions.server'
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
      throw errors.unauthorized()
    }

    if (!token) {
      throw errors.badRequest('FCM token required')
    }

    // Check if token already exists for this user
    const existing = await db
      .select()
      .from(fcmTokens)
      .where(eq(fcmTokens.userId, user.id))

    if (existing.length > 0) {
      // Update existing token
      await db
        .update(fcmTokens)
        .set({
          token,
        })
        .where(eq(fcmTokens.userId, user.id))
    } else {
      // Create new token record
      await db.insert(fcmTokens).values({
        userId: user.id,
        token,
      })
    }

    return { success: true }
  })
