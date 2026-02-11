import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { getCurrentSession } from '@/lib/sessions'
import { db } from '@/db'
import { tasks } from '@/db/schema'
import { serverTaskSchema } from '@/zod/server-task-schema'

export const createOrUpdateTodo = createServerFn({
  method: 'POST',
})
  .inputValidator(serverTaskSchema)
  .handler(async ({ data }) => {
    const now = new Date()

    const { user } = await getCurrentSession()

    if (!user) throw new Error('Unauthorized')

    // ---- DERIVE STATUS FROM TIME ONLY ----
    let status: 'scheduled' | 'completed' | 'missed'

    if (data.endTime < now) {
      status = 'missed'
    } else {
      status = 'scheduled'
    }

    if (data.id) {
      await db
        .update(tasks)
        .set({
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          notifyBeforeMinutes: data.notifyBeforeMinutes,
          isFocusSession: data.isFocusSession,
          status,
          updatedAt: new Date(),
        })
        .where(and(eq(tasks.id, data.id), eq(tasks.userId, user.id)))

      return { success: true, id: data.id }
    }

    const [created] = await db
      .insert(tasks)
      .values({
        userId: user.id,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        notifyBeforeMinutes: data.notifyBeforeMinutes,
        isFocusSession: data.isFocusSession,
        status,
      })
      .returning()

    return { success: true, id: created.id }
  })
