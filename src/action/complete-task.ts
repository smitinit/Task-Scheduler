import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { tasks } from '@/db/schema'

export const toggleTaskCompletion = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await db
      .update(tasks)
      .set({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, data.id))

    return { success: true }
  })
