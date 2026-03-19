import { getHours } from 'date-fns'
import { Moon, Sun, Sunrise } from 'lucide-react'
import type { TimeOfDay } from './types'

export function pct(n: number, total: number): number {
  if (total === 0) return 0
  return Math.round((n / total) * 100)
}

export function minutesToHours(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  if (h === 0) return `${min}m`
  if (min === 0) return `${h}h`
  return `${h}h ${min}m`
}

export function getTimeOfDay(date: Date): TimeOfDay {
  const h = getHours(date)
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 21) return 'evening'
  return 'night'
}

export const TIME_OF_DAY_CONFIG: Record<
  TimeOfDay,
  { label: string; icon: React.ElementType; range: string }
> = {
  morning: { label: 'Morning', icon: Sunrise, range: '5 – 12am' },
  afternoon: { label: 'Afternoon', icon: Sun, range: '12 – 5pm' },
  evening: { label: 'Evening', icon: Moon, range: '5 – 9pm' },
  night: { label: 'Night', icon: Moon, range: '9pm +' },
}
