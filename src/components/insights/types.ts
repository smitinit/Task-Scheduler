import type { getTasks } from '@/action/get-task'

export type Task = Awaited<ReturnType<typeof getTasks>>[number]
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export interface TimeSlotData {
  scheduled: number
  completed: number
  missed: number
}

export interface WeekDataPoint {
  label: string
  scheduled: number
  completed: number
  missed: number
}

export interface HourDataPoint {
  hour: string
  label: string
  scheduled: number
  completed: number
}

export type InsightEntry = {
  type: 'warning' | 'success' | 'info'
  message: string
}
