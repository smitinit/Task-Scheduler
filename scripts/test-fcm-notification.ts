import 'dotenv/config'

import { eq } from 'drizzle-orm'
import { db } from '../src/db'
import { fcmTokens } from '../src/db/fcmTokens'
import { getFirebaseMessaging } from '../src/lib/firebase-admin'

async function main() {
  const userId = process.argv[2]
  const title = process.argv[3] ?? 'FCM Test Notification'
  const body =
    process.argv[4] ??
    `Test push sent at ${new Date().toLocaleString('en-US', { hour12: false })}`

  const tokens = userId
    ? await db
        .select({ token: fcmTokens.token, userId: fcmTokens.userId })
        .from(fcmTokens)
        .where(eq(fcmTokens.userId, userId))
    : await db
        .select({ token: fcmTokens.token, userId: fcmTokens.userId })
        .from(fcmTokens)

  if (tokens.length === 0) {
    console.error(
      userId
        ? `No FCM tokens found for user: ${userId}`
        : 'No FCM tokens found in database.',
    )
    process.exit(1)
  }

  const messaging = getFirebaseMessaging()
  const tokenList = [...new Set(tokens.map((row) => row.token))]

  const response = await messaging.sendEachForMulticast({
    tokens: tokenList,
    webpush: {
      data: {
        title,
        body,
        icon: '/icon-192.png',
      },
    },
    data: {
      source: 'manual-test',
      sentAt: new Date().toISOString(),
    },
  })

  console.log(`Attempted: ${tokenList.length}`)
  console.log(`Success: ${response.successCount}`)
  console.log(`Failure: ${response.failureCount}`)

  response.responses.forEach((result, index) => {
    if (!result.success) {
      console.error(
        `Token ${index + 1} failed: ${result.error?.code ?? 'unknown'}`,
      )
    }
  })
}

main().catch((error) => {
  console.error('FCM test failed:', error)
  process.exit(1)
})
