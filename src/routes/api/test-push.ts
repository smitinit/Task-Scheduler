import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/db'
import { fcmTokens } from '@/db/schema'
import { messaging } from '@/lib/firebase-admin'

export const Route = createFileRoute('/api/test-push')({
  server: {
    handlers: {
      POST: async () => {
        const tokens = await db.select().from(fcmTokens)

        const tokenList = tokens.map((t) => t.token)

        if (!tokenList.length) {
          return Response.json({ error: 'No tokens found' })
        }

        const response = await messaging.sendEachForMulticast({
          tokens: tokenList,
          notification: {
            title: 'Test Notification',
            body: 'If you see this, FCM works.',
          },
        })

        return Response.json({
          success: true,
          response,
        })
      },
    },
  },
})
