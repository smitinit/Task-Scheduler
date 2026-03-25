import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { getCurrentSession } from '@/lib/sessions.server'
import { db } from '@/db'
import { tasks } from '@/db/task'
import { serverTaskSchema } from '@/zod/server-task-schema'
import { errors } from '@/lib/errors'

export const getTasks = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { user } = await getCurrentSession()

  if (!user) throw errors.unauthorized()

  const result = await db.select().from(tasks).where(eq(tasks.userId, user.id))

  const parsed = result.map((task) => serverTaskSchema.parse(task))

  // sort tasks by status (scheduled → missed → completed) and then by start time
  return parsed.sort((a, b) => {
    const order = {
      scheduled: 0,
      missed: 1,
      completed: 2,
    }

    if (order[a.status] !== order[b.status]) {
      return order[a.status] - order[b.status]
    }

    return a.startTime.getTime() - b.startTime.getTime()
  })
})
