import { createFileRoute } from '@tanstack/react-router'
import { and, eq, isNull, lt } from 'drizzle-orm'
import admin from 'firebase-admin'
import { db } from '@/db'
import { fcmTokens, notifications, tasks } from '@/db/schema'

/*
=================================================
FIREBASE INIT (once per runtime)
=================================================
*/

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const messaging = admin.messaging()

/*
=================================================
ROUTE
=================================================
*/

export const Route = createFileRoute('/api/sync-task-status')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get('authorization')
        const expected = `Bearer ${process.env.CRON_SECRET}`

        if (!authHeader || authHeader !== expected) {
          return new Response('Unauthorized', { status: 401 })
        }

        const now = new Date()

        /*
        =================================================
        1️⃣ REMINDER CREATION (IDEMPOTENT)
        =================================================
        */

        const scheduledTasks = await db
          .select()
          .from(tasks)
          .where(and(eq(tasks.status, 'scheduled'), isNull(tasks.completedAt)))

        for (const task of scheduledTasks) {
          const reminderTime = new Date(
            task.endTime.getTime() - task.notifyBeforeMinutes * 60 * 1000,
          )

          if (now >= reminderTime && now < task.endTime) {
            try {
              await db.insert(notifications).values({
                taskId: task.id,
                type: 'reminder',
                scheduledFor: reminderTime,
                status: 'pending',
              })
            } catch {
              // UNIQUE constraint prevents duplicate
              // Ignore conflict
            }
          }
        }

        /*
        =================================================
        2️⃣ MISSED CREATION (ATOMIC UPDATE)
        =================================================
        */

        const missedTasks = await db
          .update(tasks)
          .set({ status: 'missed', updatedAt: now })
          .where(
            and(
              eq(tasks.status, 'scheduled'),
              isNull(tasks.completedAt),
              lt(tasks.endTime, now),
            ),
          )
          .returning()

        for (const task of missedTasks) {
          try {
            await db.insert(notifications).values({
              taskId: task.id,
              type: 'missed',
              scheduledFor: task.endTime,
              status: 'pending',
            })
          } catch {
            // Ignore duplicate insert
          }
        }

        /*
        =================================================
        3️⃣ CLAIM NOTIFICATIONS (CRITICAL FIX)
        =================================================
        */

        const claimed = await db
          .update(notifications)
          .set({ status: 'processing' })
          .where(eq(notifications.status, 'pending'))
          .returning()

        /*
        =================================================
        4️⃣ DELIVERY
        =================================================
        */

        for (const notification of claimed) {
          try {
            const [task] = await db
              .select()
              .from(tasks)
              .where(eq(tasks.id, notification.taskId))

            const tokens = await db
              .select()
              .from(fcmTokens)
              .where(eq(fcmTokens.userId, task.userId))

            const tokenList = tokens.map((t) => t.token)

            if (!tokenList.length) {
              await db
                .update(notifications)
                .set({ status: 'failed' })
                .where(eq(notifications.id, notification.id))
              continue
            }

            const title =
              notification.type === 'reminder'
                ? 'Task Ending Soon'
                : 'Task Missed'

            const body =
              notification.type === 'reminder'
                ? `Your task "${task.title}" is about to end.`
                : `You missed "${task.title}".`

            const response = await messaging.sendEachForMulticast({
              tokens: tokenList,
              notification: { title, body },
            })

            /*
            =================================================
            HANDLE PARTIAL FAILURES
            =================================================
            */

            response.responses.forEach(async (res, idx) => {
              if (!res.success) {
                const errorCode = res.error?.code

                // Remove invalid tokens
                if (
                  errorCode === 'messaging/registration-token-not-registered' ||
                  errorCode === 'messaging/invalid-registration-token'
                ) {
                  await db
                    .delete(fcmTokens)
                    .where(eq(fcmTokens.token, tokenList[idx]))
                }
              }
            })

            await db
              .update(notifications)
              .set({
                status: 'sent',
                sentAt: new Date(),
              })
              .where(eq(notifications.id, notification.id))
          } catch (err) {
            await db
              .update(notifications)
              .set({ status: 'failed' })
              .where(eq(notifications.id, notification.id))
          }
        }

        return Response.json({ success: true })
      },
    },
  },
})
