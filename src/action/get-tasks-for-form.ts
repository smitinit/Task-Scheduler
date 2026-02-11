import { createServerFn } from '@tanstack/react-start'
import { startOfToday } from 'date-fns'
import { and, eq, gte } from 'drizzle-orm'
import { getCurrentSession } from '@/lib/sessions'
import { db } from '@/db'
import { tasks } from '@/db/schema'

export const getTasksForForm = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { user } = await getCurrentSession()

  if (!user) throw new Error('Unauthorized')

  return await db
    .select()
    .from(tasks)
    .where(and(gte(tasks.endTime, startOfToday()), eq(tasks.userId, user.id)))
})
