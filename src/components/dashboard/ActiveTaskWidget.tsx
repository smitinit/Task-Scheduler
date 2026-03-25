import { differenceInMinutes, format } from 'date-fns'
import { CircleDashed } from 'lucide-react'
import { memo } from 'react'
import { taskProgress } from './helpers'
import type { Task } from '@/types/task'

function ActiveTaskWidgetComponent({
  task,
  now,
}: {
  task: Task | null
  now: Date
}) {
  if (!task) {
    return (
      <div className="glass-widget border-none flex items-center gap-3 text-muted-foreground">
        <CircleDashed className="w-5 h-5" />
        <div>
          <p className="text-sm font-medium">No active task</p>
          <p className="text-xs mt-0.5">Free time — or schedule something</p>
        </div>
      </div>
    )
  }

  const progress = taskProgress(task, now)
  const remaining = differenceInMinutes(new Date(task.endTime), now)

  return (
    <div className="glass rounded-2xl border-none bg-emerald-500/10 dark:bg-emerald-500/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Active Now
        </span>
      </div>
      <p className="font-semibold text-base">{task.title}</p>
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-mono">
        <span>{format(new Date(task.startTime), 'HH:mm')}</span>
        <span>→</span>
        <span>{format(new Date(task.endTime), 'HH:mm')}</span>
        <span className="ml-auto text-emerald-600 dark:text-emerald-400 font-medium">
          {remaining}m left
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Memoize to avoid re-renders when parent's `now` prop updates
// Only re-render if task reference changes (id check) since UI updates per minute
export const ActiveTaskWidget = memo(
  ActiveTaskWidgetComponent,
  (prev, next) => {
    // Return true if props are equal (don't re-render), false if different (re-render)
    const sameTask = prev.task?.id === next.task?.id
    const sameMinute =
      prev.now.getMinutes() === next.now.getMinutes() &&
      prev.now.getHours() === next.now.getHours()
    return sameTask && sameMinute
  },
)
