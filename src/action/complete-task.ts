import { and, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getCurrentSession } from '@/lib/sessions.server'
import { db } from '@/db'
import { tasks } from '@/db/task'
import { errors } from '@/lib/errors'

export const markTaskCompletion = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const { user } = await getCurrentSession()

    if (!user) throw errors.unauthorized()

    await db
      .update(tasks)
      .set({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, user.id)))

    return { success: true }
  })
