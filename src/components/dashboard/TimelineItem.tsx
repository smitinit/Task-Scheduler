import { differenceInMinutes, format, isWithinInterval } from 'date-fns'
import {
  Activity,
  AlarmClock,
  CheckCircle2,
  Flame,
  XCircle,
} from 'lucide-react'
import { STATUS_CONFIG, taskProgress } from './helpers'
import type { Task } from './helpers'
import { Button } from '@/components/ui/button'

export function TimelineItem({
  task,
  now,
  onComplete,
}: {
  task: Task
  now: Date
  onComplete: (id: number) => void
}) {
  const isActive = isWithinInterval(now, {
    start: new Date(task.startTime),
    end: new Date(task.endTime),
  })
  const cfg = STATUS_CONFIG[task.status]
  const progress = isActive ? taskProgress(task, now) : 0
  const minsUntil = differenceInMinutes(new Date(task.startTime), now)
  const isImminent = minsUntil > 0 && minsUntil <= task.notifyBeforeMinutes

  return (
    <div
      className={`relative flex gap-4 group ${
        isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'
      } transition-opacity`}
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div
          className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ring-2 ring-background ${cfg.dot} ${
            isActive ? 'ring-offset-1 shadow-[0_0_8px_2px] shadow-current' : ''
          }`}
        />
        <div className="w-px flex-1 bg-border mt-1" />
      </div>

      {/* Content */}
      <div
        className={`flex-1 mb-4 rounded-lg border p-3 ${cfg.border} ${
          isActive ? cfg.bg : 'bg-muted/20'
        } transition-colors`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {format(new Date(task.startTime), 'HH:mm')}–
                {format(new Date(task.endTime), 'HH:mm')}
              </span>
              {task.isFocusSession && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  <Flame className="w-2.5 h-2.5" /> Focus
                </span>
              )}
              {isActive && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded animate-pulse">
                  <Activity className="w-2.5 h-2.5" /> Active
                </span>
              )}
              {isImminent && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  <AlarmClock className="w-2.5 h-2.5" /> {minsUntil}m
                </span>
              )}
            </div>
            <p className="font-medium text-sm mt-0.5 truncate">{task.title}</p>
          </div>

          {task.status === 'scheduled' && (
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 h-7 px-2 text-xs transition-opacity"
              onClick={() => onComplete(task.id)}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Done
            </Button>
          )}
          {task.status === 'completed' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          )}
          {task.status === 'missed' && (
            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
        </div>

        {isActive && (
          <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
