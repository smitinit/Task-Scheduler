/**
 * Task domain model and types
 * Single source of truth for task-related types
 */

export interface Task {
  id: number
  userId?: string // Optional on client - set by server
  title: string
  description: string | null
  startTime: Date
  endTime: Date
  notifyBeforeMinutes: number
  status: 'scheduled' | 'completed' | 'missed'
  isFocusSession: boolean
  completedAt: Date | null | undefined
  createdAt: Date
  updatedAt: Date
}

export interface TaskCreateInput {
  title: string
  description: string
  startTime: Date
  endTime: Date
  notifyBeforeMinutes: number
  isFocusSession: boolean
}

export interface TaskUpdateInput extends Partial<TaskCreateInput> {
  id: number
  status?: Task['status']
}

export interface TaskListResponse {
  tasks: Array<Task>
  total: number
}

export interface TaskDetailResponse {
  task: Task | null
}

// Grouping utilities
export type TasksByStatus = Record<Task['status'], Array<Task>>

export function groupTasksByStatus(tasks: Array<Task>): TasksByStatus {
  return {
    scheduled: tasks.filter((t) => t.status === 'scheduled'),
    completed: tasks.filter((t) => t.status === 'completed'),
    missed: tasks.filter((t) => t.status === 'missed'),
  }
}

// Time calculations
export function getTaskDuration(task: Task): number {
  return task.endTime.getTime() - task.startTime.getTime()
}

export function getTaskDurationMinutes(task: Task): number {
  return getTaskDuration(task) / (1000 * 60)
}

export function isTaskActive(task: Task, now: Date = new Date()): boolean {
  return task.startTime <= now && now <= task.endTime
}

export function isTaskUpcoming(task: Task, now: Date = new Date()): boolean {
  return task.startTime > now && task.status === 'scheduled'
}

export function isTaskMissed(task: Task, now: Date = new Date()): boolean {
  return task.endTime < now && task.status === 'scheduled'
}
