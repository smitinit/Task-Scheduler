import { createFileRoute } from '@tanstack/react-router'
import { and, eq, ne } from 'drizzle-orm'
import { db } from '@/db'
import { fcmTokens } from '@/db/fcmTokens'
import { getCurrentSession } from '@/lib/session-server'

export const Route = createFileRoute('/api/register-fcm-token')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { user } = await getCurrentSession()
        if (!user) return new Response('Unauthorized', { status: 401 })

        const { token } = await request.json()

        await db
          .insert(fcmTokens)
          .values({
            userId: user.id,
            token,
          })
          .onConflictDoUpdate({
            target: fcmTokens.token,
            set: { userId: user.id },
          })

        await db
          .delete(fcmTokens)
          .where(and(eq(fcmTokens.userId, user.id), ne(fcmTokens.token, token)))

        return Response.json({ success: true })
      },
    },
  },
})
