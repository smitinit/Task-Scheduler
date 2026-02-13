import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/db'
import { fcmTokens } from '@/db/schema'
import { getCurrentSession } from '@/lib/sessions'

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
            target: fcmTokens.userId,
            set: { token },
          })

        return Response.json({ success: true })
      },
    },
  },
})
