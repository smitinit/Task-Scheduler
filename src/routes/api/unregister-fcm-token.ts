import { createFileRoute } from '@tanstack/react-router'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { fcmTokens } from '@/db/fcmTokens'
import { getCurrentSession } from '@/lib/session-server'

export const Route = createFileRoute('/api/unregister-fcm-token')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { user } = await getCurrentSession()
        if (!user) return new Response('Unauthorized', { status: 401 })

        const body = await request.json().catch(() => ({}))
        const token = body?.token as string | undefined

        if (!token) {
          // Fallback: clear all tokens for this user when specific token cannot be resolved.
          console.info(
            `[FCM] Unregister request without token; clearing all tokens for user ${user.id}`,
          )
          await db.delete(fcmTokens).where(eq(fcmTokens.userId, user.id))
          return Response.json({ success: true, clearedAll: true })
        }

        console.info(`[FCM] Unregistering token for user ${user.id}`)

        await db
          .delete(fcmTokens)
          .where(and(eq(fcmTokens.userId, user.id), eq(fcmTokens.token, token)))

        return Response.json({ success: true })
      },
    },
  },
})
