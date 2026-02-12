// import { createFileRoute } from '@tanstack/react-router'
// import { and, eq, isNull, lt } from 'drizzle-orm'
// import { db } from '@/db'
// import { tasks } from '@/db/schema'

// export const Route = createFileRoute('/api/sync-task-status')({
//   server: {
//     handlers: {
//       POST: async ({ request }) => {
//         const authHeader = request.headers.get('authorization')

//         const expected = `Bearer ${process.env.CRON_SECRET}`

//         if (!authHeader || authHeader !== expected) {
//           return new Response('Unauthorized', { status: 401 })
//         }

//         const now = new Date()

//         await db
//           .update(tasks)
//           .set({ status: 'missed' })
//           .where(
//             and(
//               lt(tasks.endTime, now),
//               isNull(tasks.completedAt),
//               eq(tasks.status, 'scheduled'),
//             ),
//           )

//         return Response.json({ success: true })
//       },
//     },
//   },
// })

import { createFileRoute } from '@tanstack/react-router'
import { and, eq, isNull, lt } from 'drizzle-orm'
import { db } from '@/db'
import { fcmTokens, notifications, tasks } from '@/db/schema'
import { messaging } from '@/lib/firebase-admin'

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
        ============================================
        1️⃣ REMINDER CREATION
        ============================================
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
            const existing = await db
              .select()
              .from(notifications)
              .where(
                and(
                  eq(notifications.taskId, task.id),
                  eq(notifications.type, 'reminder'),
                ),
              )

            if (existing.length === 0) {
              await db.insert(notifications).values({
                taskId: task.id,
                type: 'reminder',
                scheduledFor: reminderTime,
                status: 'pending',
              })
            }
          }
        }

        /*
        ============================================
        2️⃣ MISSED CREATION
        ============================================
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
          await db.insert(notifications).values({
            taskId: task.id,
            type: 'missed',
            scheduledFor: task.endTime,
            status: 'pending',
          })
        }

        /*
        ============================================
        3️⃣ DELIVERY
        ============================================
        */

        const pendingNotifications = await db
          .select()
          .from(notifications)
          .where(eq(notifications.status, 'pending'))

        for (const notification of pendingNotifications) {
          const task = await db
            .select()
            .from(tasks)
            .where(eq(tasks.id, notification.taskId))
            .then((res) => res[0])

          const tokens = await db
            .select()
            .from(fcmTokens)
            .where(eq(fcmTokens.userId, task.userId))

          const tokenList = tokens.map((t) => t.token)
          if (!tokenList.length) continue

          const title =
            notification.type === 'reminder'
              ? 'Task Ending Soon'
              : 'Task Missed'

          const body =
            notification.type === 'reminder'
              ? `Your task "${task.title}" is about to end.`
              : `You missed "${task.title}".`

          await messaging.sendEachForMulticast({
            tokens: tokenList,
            notification: { title, body },
          })

          await db
            .update(notifications)
            .set({
              status: 'sent',
              sentAt: new Date(),
            })
            .where(eq(notifications.id, notification.id))
        }

        return Response.json({ success: true })
      },
    },
  },
})
