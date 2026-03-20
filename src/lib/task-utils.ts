import { addMinutes, format, intervalToDuration } from 'date-fns'

export function roundToNext5Minutes(date: Date) {
  const minutes = date.getMinutes()
  const remainder = minutes % 5
  const offset = remainder === 0 ? 0 : 5 - remainder
  return addMinutes(date, offset)
}

export function toInputDateTime(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

export function formatTaskDuration(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (!start || !end || endDate <= startDate) return '0m'

  const duration = intervalToDuration({
    start: startDate,
    end: endDate,
  })

  const parts = []

  if (duration.days) parts.push(`${duration.days}d`)
  if (duration.hours) parts.push(`${duration.hours}h`)
  if (duration.minutes) parts.push(`${duration.minutes}m`)

  return parts.join(' ')
}
