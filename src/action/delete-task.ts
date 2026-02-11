import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { tasks } from '@/db/schema'

export const deleteTask = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await db.delete(tasks).where(eq(tasks.id, data.id))
    return { success: true }
  })
