import { createServerFn } from '@tanstack/react-start'
import { startOfToday } from 'date-fns'
import { and, eq, gte } from 'drizzle-orm'
import { getCurrentSession } from '@/lib/session-server'
import { db } from '@/db'
import { tasks } from '@/db/task'
import { errors } from '@/lib/errors'

export const getTasksForForm = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { user } = await getCurrentSession()

  if (!user) throw errors.unauthorized()

  return await db
    .select()
    .from(tasks)
    .where(and(gte(tasks.endTime, startOfToday()), eq(tasks.userId, user.id)))
})
