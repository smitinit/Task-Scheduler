import { createFileRoute } from '@tanstack/react-router'
import { and, eq, isNull, lt } from 'drizzle-orm'
import { db } from '@/db'
import { tasks } from '@/db/schema'

export const Route = createFileRoute('/api/sync-task-status')({
  server: {
    handlers: {
      POST: async () => {
        const now = new Date()

        await db
          .update(tasks)
          .set({ status: 'missed' })
          .where(
            and(
              lt(tasks.endTime, now),
              isNull(tasks.completedAt),
              eq(tasks.status, 'scheduled'),
            ),
          )

        return Response.json({ success: true })
      },
    },
  },
})
