import { format } from 'date-fns'
import { Clock, Timer } from 'lucide-react'
import { formatCountdown } from './helpers'
import type { Task } from '@/types/task'

export function NextTaskWidget({
  task,
  now,
}: {
  task: Task | null
  now: Date
}) {
  if (!task) {
    return (
      <div className="glass-widget border-none flex items-center gap-3 text-muted-foreground">
        <Timer className="w-5 h-5" />
        <div>
          <p className="text-sm font-medium">Nothing scheduled next</p>
          <p className="text-xs mt-0.5">You're clear for the rest of the day</p>
        </div>
      </div>
    )
  }

  const msUntil = new Date(task.startTime).getTime() - now.getTime()
  const isNotifyWindow = msUntil <= task.notifyBeforeMinutes * 60 * 1000

  return (
    <div
      className={`glass border-none rounded-2xl p-4 ${
        isNotifyWindow ? 'bg-amber-500/10 dark:bg-amber-500/5' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Clock
          className={`w-3.5 h-3.5 ${
            isNotifyWindow ? 'text-amber-500' : 'text-muted-foreground'
          }`}
        />
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${
            isNotifyWindow
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-muted-foreground'
          }`}
        >
          Up Next
        </span>
      </div>
      <p className="font-semibold text-base">{task.title}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-muted-foreground font-mono">
          {format(new Date(task.startTime), 'HH:mm')}
        </span>
        <span
          className={`text-sm font-mono font-bold tabular-nums ${
            isNotifyWindow ? 'text-amber-500' : 'text-foreground'
          }`}
        >
          {formatCountdown(msUntil)}
        </span>
      </div>
    </div>
  )
}
