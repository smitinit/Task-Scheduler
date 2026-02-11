import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  addMinutes,
  differenceInMinutes,
  format,
  intervalToDuration,
} from 'date-fns'

import { TriangleAlert } from 'lucide-react'
import type { z } from 'zod'
import { taskSchema } from '@/zod/task-schema'

import { createOrUpdateTodo } from '@/action/create-update-task'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { getTasksForForm } from '@/action/get-tasks-for-form'

type TaskFormValues = z.infer<typeof taskSchema>

export const Route = createFileRoute('/')({
  loader: async () => {
    const tasks = await getTasksForForm()
    return { tasks }
  },
  component: TaskFormPage,
})

/* ---------------- Utilities ---------------- */

function roundToNext5Minutes(date: Date) {
  const minutes = date.getMinutes()
  const remainder = minutes % 5
  const offset = remainder === 0 ? 0 : 5 - remainder
  return addMinutes(date, offset)
}

function toInputDateTime(date: Date) {
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

function findOverlappingTasks(
  start: Date,
  end: Date,
  tasks: Awaited<ReturnType<typeof getTasksForForm>>,
) {
  return tasks.filter((task) => {
    const existingStart = new Date(task.startTime)
    const existingEnd = new Date(task.endTime)

    return (
      start < existingEnd && end > existingStart && task.status !== 'completed'
    )
  })
}

/* ---------------- Chips ---------------- */

const durationPresets = [
  { label: '25m Focus', value: 25 },
  { label: '45m Work', value: 45 },
  { label: '1h Block', value: 60 },
]

const notifyPresets = [
  { label: '5m', value: 5 },
  { label: '10m', value: 10 },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: 'Custom', value: -1 },
]

/* ---------------- Component ---------------- */

function TaskFormPage() {
  const navigate = useNavigate()
  const { tasks } = Route.useLoaderData()

  const now = roundToNext5Minutes(new Date())

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      startTime: toInputDateTime(now),
      endTime: toInputDateTime(addMinutes(now, 25)),
      notifyBeforeMinutes: 5,
      isFocusSession: false,
    },
  })

  const {
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const start = watch('startTime')
  const end = watch('endTime')
  const notifyValue = watch('notifyBeforeMinutes')
  const isCustom = !notifyPresets.some(
    (p) => p.value !== -1 && p.value === notifyValue,
  )

  const overlappingTasks =
    start && end
      ? findOverlappingTasks(new Date(start), new Date(end), tasks)
      : []

  const hasConflict = overlappingTasks.length > 0

  const lastEndTime =
    overlappingTasks.length > 0
      ? new Date(
          Math.max(
            ...overlappingTasks.map((t) => new Date(t.endTime).getTime()),
          ),
        )
      : null

  const durationMinutes =
    start && end
      ? Math.max(0, differenceInMinutes(new Date(end), new Date(start)))
      : 0

  function inputError(name: keyof TaskFormValues) {
    return errors[name] ? 'border-red-500 focus-visible:ring-red-500' : ''
  }

  function setDuration(minutes: number) {
    const newEnd = addMinutes(new Date(start), minutes)
    setValue('endTime', toInputDateTime(newEnd), {
      shouldValidate: true,
    })
  }

  async function onSubmit(values: TaskFormValues) {
    try {
      await createOrUpdateTodo({
        data: {
          ...values,
          startTime: new Date(values.startTime),
          endTime: new Date(values.endTime),
        },
      })
      navigate({ to: '/tasks' })
    } catch (err) {
      form.setError('root', {
        type: 'server',
        message: 'Something went wrong. Try again.',
      })
    }
  }

  useEffect(() => {
    if (durationMinutes > 0 && notifyValue >= durationMinutes) {
      setValue('notifyBeforeMinutes', Math.max(0, durationMinutes - 1), {
        shouldValidate: true,
      })
    }
  }, [durationMinutes, notifyValue, setValue])

  // useEffect(() => {
  //   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  // }, [])

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-semibold">Create Task</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="quick">
          <TabsList>
            <TabsTrigger value="quick">Quick</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* ---------------- QUICK TAB ---------------- */}

          <TabsContent value="quick" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                autoFocus
                className={inputError('title')}
                placeholder="Task title"
                {...form.register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-500 transition-all duration-200">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Set Duration</Label>

              <div className="flex gap-2 flex-wrap">
                {durationPresets.map((duration) => (
                  <Button
                    key={duration.value}
                    type="button"
                    size="sm"
                    variant={
                      durationMinutes === duration.value ? 'default' : 'outline'
                    }
                    onClick={() => setDuration(duration.value)}
                  >
                    {duration.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  className={inputError('startTime')}
                  type="datetime-local"
                  {...form.register('startTime')}
                />
                {errors.startTime && (
                  <p className="text-sm text-red-500 transition-all duration-200">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  className={inputError('endTime')}
                  type="datetime-local"
                  {...form.register('endTime')}
                />
                {errors.endTime && (
                  <p className="text-sm text-red-500 transition-all duration-200">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground transition-all duration-200">
              Duration: {formatTaskDuration(start, end)}
            </div>

            <div className="space-y-3">
              <Label>Notify Before</Label>

              <div className="flex gap-2 flex-wrap">
                {notifyPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    type="button"
                    size="sm"
                    variant={
                      preset.value === -1
                        ? isCustom
                          ? 'default'
                          : 'outline'
                        : notifyValue === preset.value
                          ? 'default'
                          : 'outline'
                    }
                    onClick={() => {
                      if (preset.value === -1) return
                      setValue('notifyBeforeMinutes', preset.value, {
                        shouldValidate: true,
                      })
                    }}
                    disabled={
                      preset.value !== -1 &&
                      durationMinutes > 0 &&
                      preset.value >= durationMinutes
                    }
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>

              <Input
                className={inputError('notifyBeforeMinutes')}
                type="number"
                min={0}
                {...form.register('notifyBeforeMinutes', {
                  valueAsNumber: true,
                  min: 0,
                })}
              />
              {errors.notifyBeforeMinutes && (
                <p className="text-sm text-red-500 transition-all duration-200">
                  {errors.notifyBeforeMinutes.message}
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Notify:{' '}
              {notifyValue >= 60
                ? `${notifyValue / 60}h before`
                : `${notifyValue}m before`}
            </div>
          </TabsContent>

          {/* ---------------- ADVANCED TAB ---------------- */}

          <TabsContent value="advanced" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                className={inputError('description')}
                rows={4}
                {...form.register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-500 transition-all duration-200">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label>Focus Session</Label>
              <Switch
                checked={form.watch('isFocusSession')}
                onCheckedChange={(v) => setValue('isFocusSession', v)}
              />
            </div>
          </TabsContent>
        </Tabs>

        {hasConflict && lastEndTime && (
          <div className="p-3 rounded-md border dark:border-yellow-200 dark:text-yellow-500 border-yellow-600 text-yellow-800 text-sm flex flex-col gap-2">
            <span className="flex items-center gap-2">
              <TriangleAlert className="w-5 h-5" /> This time range overlaps
              with existing tasks.
            </span>
            <div className="mt-1 text-xs">
              Overlaps with {overlappingTasks.length} task(s):
              <ul className="list-disc ml-4 mt-1">
                {overlappingTasks.map((t) => (
                  <li key={t.id} className="space-y-0.5">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-yellow-800/80 dark:text-yellow-500/80">
                      {(() => {
                        const startDate = new Date(t.startTime)
                        const endDate = new Date(t.endTime)

                        const sameDay =
                          startDate.toDateString() === endDate.toDateString()

                        if (sameDay) {
                          return (
                            <>
                              {format(startDate, 'MMM d')} ·{' '}
                              {format(startDate, 'p')} - {format(endDate, 'p')}
                            </>
                          )
                        }

                        return (
                          <>
                            {format(startDate, 'MMM d · p')} →{' '}
                            {format(endDate, 'MMM d · p')}
                          </>
                        )
                      })()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-1">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const currentDuration = differenceInMinutes(
                    new Date(end),
                    new Date(start),
                  )
                  const newStart = lastEndTime
                  const newEnd = addMinutes(newStart, currentDuration)

                  setValue('startTime', toInputDateTime(newStart))
                  setValue('endTime', toInputDateTime(newEnd))
                }}
              >
                Use {format(lastEndTime, 'MMM d, p')} instead
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
        </div>

        {errors.root && (
          <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
            {errors.root.message}
          </div>
        )}
      </form>
    </div>
  )
}
