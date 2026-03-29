import { createFileRoute } from '@tanstack/react-router'
import { and, eq, isNull, lt } from 'drizzle-orm'
import { db } from '@/db'
import { tasks } from '@/db/task'
import { notifications } from '@/db/notification'
import { fcmTokens } from '@/db/fcmTokens'
import { getFirebaseMessaging } from '@/lib/firebase-admin'

export const Route = createFileRoute('/api/sync-task-status')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get('authorization')
        const expected = `Bearer ${process.env.CRON_SECRET}`

        if (!authHeader || authHeader !== expected) {
          return new Response('Unauthorized', { status: 401 })
        }

        let messaging

        try {
          messaging = getFirebaseMessaging()
        } catch (error) {
          console.error('Firebase Admin initialization failed:', error)
          return new Response('Firebase is not configured correctly', {
            status: 500,
          })
        }

        const now = new Date()

        // Remainder creation, find task => still scheduled, and not completed

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

        // mark missed, find task => still scheduled, not completed, and endTime passed

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

        // Claim pending notifications for processing

        const claimed = await db
          .update(notifications)
          .set({ status: 'processing' })
          .where(eq(notifications.status, 'pending'))
          .returning()

        // map each notification to its task, get userId, find FCM tokens, and send notification

        for (const notification of claimed) {
          try {
            const taskRows = await db
              .select()
              .from(tasks)
              .where(eq(tasks.id, notification.taskId))
            const task = taskRows.at(0)

            if (!task) {
              await db
                .update(notifications)
                .set({ status: 'failed' })
                .where(eq(notifications.id, notification.id))
              continue
            }

            const tokens = await db
              .select({ token: fcmTokens.token })
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
              webpush: {
                data: {
                  title,
                  body,
                  icon: '/icon-192.png',
                },
              },
            })

            // handle response, remove invalid tokens, and mark notification as sent or failed

            for (const [idx, res] of response.responses.entries()) {
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
            }

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

        // final success
        return Response.json({ success: true })
      },
    },
  },
})
