import { createServerFn } from '@tanstack/react-start'
import { startOfToday } from 'date-fns'
import { gte } from 'drizzle-orm'
import { db } from '@/db'
import { tasks } from '@/db/schema'

export const getTasksForForm = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.select().from(tasks).where(gte(tasks.endTime, startOfToday()))
})
