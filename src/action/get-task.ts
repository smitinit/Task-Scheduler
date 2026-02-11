import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { tasks } from '@/db/schema'
import { serverTaskSchema } from '@/zod/server-task-schema'

export const getTasks = createServerFn({
  method: 'GET',
}).handler(async () => {
  const result = await db.select().from(tasks)

  const parsed = result.map((task) => serverTaskSchema.parse(task))

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
