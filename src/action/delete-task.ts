import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { tasks } from '@/db/schema'
import { getCurrentSession } from '@/lib/sessions'

export const deleteTask = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const { user } = await getCurrentSession()

    if (!user) throw new Error('Unauthorized')

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, user.id)))

    return { success: true }
  })
