import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { tasks } from '@/db/task'
import { getCurrentSession } from '@/lib/session-server'
import { errors } from '@/lib/errors'

export const deleteTask = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const { user } = await getCurrentSession()

    if (!user) throw errors.unauthorized()

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, user.id)))

    return { success: true }
  })
