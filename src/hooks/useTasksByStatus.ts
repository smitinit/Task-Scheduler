import { useMemo } from 'react'
import { isToday } from 'date-fns'
import type { ServerTaskInput } from '@/zod/server-task-schema'

interface TasksByStatus {
  today: Array<ServerTaskInput>
  upcoming: Array<ServerTaskInput>
  missed: Array<ServerTaskInput>
  completed: Array<ServerTaskInput>
  totalFocus: number
}

/**
 * Hook to categorize tasks by status and time
 */
export function useTasksByStatus(tasks: Array<ServerTaskInput>): TasksByStatus {
  return useMemo(() => {
    const now = new Date()

    const today = tasks.filter(
      (t) => isToday(t.startTime) && t.status === 'scheduled',
    )

    const upcoming = tasks.filter(
      (t) =>
        !isToday(t.startTime) && t.startTime > now && t.status === 'scheduled',
    )

    const missed = tasks.filter((t) => t.status === 'missed')

    const completed = tasks.filter((t) => t.status === 'completed')

    const totalFocus = tasks.filter((t) => t.isFocusSession).length

    return { today, upcoming, missed, completed, totalFocus }
  }, [tasks])
}
