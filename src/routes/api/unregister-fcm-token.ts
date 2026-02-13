import { createFileRoute } from '@tanstack/react-router'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { fcmTokens } from '@/db/schema'
import { getCurrentSession } from '@/lib/sessions'

export const Route = createFileRoute('/api/unregister-fcm-token')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { user } = await getCurrentSession()
        if (!user) return new Response('Unauthorized', { status: 401 })

        const { token } = await request.json()

        if (!token) return new Response('Token required', { status: 400 })

        await db
          .delete(fcmTokens)
          .where(and(eq(fcmTokens.userId, user.id), eq(fcmTokens.token, token)))

        return Response.json({ success: true })
      },
    },
  },
})
