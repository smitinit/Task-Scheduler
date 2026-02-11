import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getCurrentSession } from '@/lib/sessions'
import { db } from '@/db'
import { tasks } from '@/db/schema'

export const getTaskById = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      id: z.number().int().positive(),
    }),
  )
  .handler(async ({ data }) => {
    const { user } = await getCurrentSession()

    if (!user) throw new Error('Unauthorized')

    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, data.id), eq(tasks.userId, user.id)))

    return task
  })
