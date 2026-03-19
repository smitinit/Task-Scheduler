import { addMinutes, differenceInMinutes, format } from 'date-fns'

export function toInputDateTime(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

export function roundToNext5(date: Date): Date {
  const m = date.getMinutes()
  return addMinutes(date, m % 5 === 0 ? 0 : 5 - (m % 5))
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Now'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export type Task = any

export function taskProgress(task: Task, now: Date): number {
  const total = differenceInMinutes(
    new Date(task.endTime),
    new Date(task.startTime),
  )
  const elapsed = differenceInMinutes(now, new Date(task.startTime))
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

export const STATUS_CONFIG: Record<
  Task['status'],
  { bg: string; border: string; dot: string }
> = {
  scheduled: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dot: 'bg-blue-500',
  },
  completed: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  missed: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
}
