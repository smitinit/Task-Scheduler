import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { tasks } from '@/db/schema'
import { serverTaskSchema } from '@/zod/server-task-schema'

export const createOrUpdateTodo = createServerFn({
  method: 'POST',
})
  .inputValidator(serverTaskSchema)
  .handler(async ({ data }) => {
    const now = new Date()

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
        .where(eq(tasks.id, data.id))

      return { success: true, id: data.id }
    }

    const [created] = await db
      .insert(tasks)
      .values({
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
