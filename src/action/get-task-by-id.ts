import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
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
    const [task] = await db.select().from(tasks).where(eq(tasks.id, data.id))

    return task
  })
