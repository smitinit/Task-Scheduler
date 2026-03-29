import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'

import {
  addMinutes,
  differenceInMinutes,
  format,
  getDay,
  parse,
  startOfWeek,
} from 'date-fns'
import { enUS } from 'date-fns/locale'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader,
  Plus,
  TriangleAlert,
} from 'lucide-react'
import type { z } from 'zod'

import type { Event as RBCEvent, SlotInfo, View } from 'react-big-calendar'
import type { getTasksForForm } from '@/action/get-tasks-for-form'
import { formatTaskDuration } from '@/lib/task-utils'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { taskSchema } from '@/zod/task-schema'
import { createOrUpdateTodo } from '@/action/create-update-task'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Route } from '@/routes/calendar'

/* ─── Types ─── */

type TaskFormValues = z.infer<typeof taskSchema>
type LoadedTask = Awaited<ReturnType<typeof getTasksForForm>>[number]

interface CalendarEvent extends RBCEvent {
  id: number
  status: LoadedTask['status']
  isFocusSession: boolean
  resource?: LoadedTask
}

/* ─── Localizer ─── */

const locales = { 'en-US': enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay,
  locales,
})

/* ─── Helpers ─── */

function toInputDateTime(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

function roundToNext5Minutes(date: Date) {
  const m = date.getMinutes()
  const offset = m % 5 === 0 ? 0 : 5 - (m % 5)
  return addMinutes(date, offset)
}

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
]

function statusColor(status: LoadedTask['status'], isFocus: boolean) {
  // Using theme colors: primary for scheduled/focus, chart-1 for completed, destructive for missed
  if (isFocus)
    return {
      bg: 'var(--primary)',
      border: 'color-mix(in oklch, var(--primary) 60%, var(--foreground))',
    }
  if (status === 'completed')
    return {
      bg: 'var(--chart-1)',
      border: 'color-mix(in oklch, var(--chart-1) 60%, var(--foreground))',
    }
  if (status === 'missed')
    return {
      bg: 'var(--destructive)',
      border: 'color-mix(in oklch, var(--destructive) 60%, var(--foreground))',
    }
  return {
    bg: 'var(--primary)',
    border: 'color-mix(in oklch, var(--primary) 60%, var(--foreground))',
  }
}

/* ─── Custom Event Component ─── */

function EventTile({ event }: { event: CalendarEvent }) {
  const colors = statusColor(event.status, event.isFocusSession)
  const duration =
    event.start && event.end ? differenceInMinutes(event.end, event.start) : 0
  const isShort = duration <= 30

  return (
    <div
      className="h-full px-1.5 py-0.5 rounded-sm text-white overflow-hidden flex flex-col gap-0.5"
      style={{
        background: colors.bg,
        borderLeft: `3px solid ${colors.border}`,
      }}
    >
      <span className="font-medium text-[11px] leading-tight truncate">
        {event.title as string}
      </span>
      {!isShort && (
        <span className="text-[10px] opacity-80">
          {format(event.start as Date, 'p')} – {format(event.end as Date, 'p')}
        </span>
      )}
      {event.isFocusSession && !isShort && (
        <span className="text-[9px] uppercase tracking-wide opacity-70">
          Focus
        </span>
      )}
    </div>
  )
}

/* ─── Toolbar ─── */

function CustomToolbar({ label, onNavigate, onView, view }: any) {
  return (
    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onNavigate('PREV')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => onNavigate('TODAY')}>
          Today
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => onNavigate('NEXT')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <h2 className="text-base font-semibold ml-1">{label}</h2>
      </div>
      <div className="flex gap-1">
        {(['month', 'week', 'day', 'agenda'] as Array<View>).map((v) => (
          <Button
            key={v}
            size="sm"
            variant={view === v ? 'default' : 'outline'}
            onClick={() => onView(v)}
            className="capitalize"
          >
            {v}
          </Button>
        ))}
      </div>
    </div>
  )
}

/* ─── Task Modal Form ─── */

interface TaskModalProps {
  open: boolean
  defaultStart: Date
  defaultEnd: Date
  tasks: Array<LoadedTask>
  onClose: () => void
  onSuccess: (task: LoadedTask) => void
}

function TaskModal({
  open,
  defaultStart,
  defaultEnd,
  tasks,
  onClose,
  onSuccess,
}: TaskModalProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      startTime: toInputDateTime(defaultStart),
      endTime: toInputDateTime(defaultEnd),
      notifyBeforeMinutes: 5,
      isFocusSession: false,
    },
  })

  useState(() => {
    form.reset({
      title: '',
      description: '',
      startTime: toInputDateTime(defaultStart),
      endTime: toInputDateTime(defaultEnd),
      notifyBeforeMinutes: 5,
      isFocusSession: false,
    })
  })

  const {
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form
  const start = watch('startTime')
  const end = watch('endTime')
  const notifyValue = watch('notifyBeforeMinutes')

  const durationMinutes =
    start && end
      ? Math.max(0, differenceInMinutes(new Date(end), new Date(start)))
      : 0

  function setDuration(minutes: number) {
    setValue('endTime', toInputDateTime(addMinutes(new Date(start), minutes)), {
      shouldValidate: true,
    })
  }

  function inputError(name: keyof TaskFormValues) {
    return errors[name] ? 'border-red-500 focus-visible:ring-red-500' : ''
  }

  const overlapping = useMemo(() => {
    if (!start || !end) return []
    const s = new Date(start),
      e = new Date(end)
    return tasks.filter((t) => {
      const ts = new Date(t.startTime),
        te = new Date(t.endTime)
      return s < te && e > ts && t.status !== 'completed'
    })
  }, [start, end, tasks])

  async function onSubmit(values: TaskFormValues) {
    try {
      const result = await createOrUpdateTodo({
        data: {
          ...values,
          startTime: new Date(values.startTime),
          endTime: new Date(values.endTime),
        },
      })
      onSuccess({
        id: result.id,
        title: values.title,
        description: values.description ?? '',
        startTime: new Date(values.startTime),
        endTime: new Date(values.endTime),
        notifyBeforeMinutes: values.notifyBeforeMinutes,
        isFocusSession: values.isFocusSession,
        status: 'scheduled',
      } as unknown as LoadedTask)
      onClose()
    } catch {
      form.setError('root', {
        type: 'server',
        message: 'Something went wrong. Try again.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              autoFocus
              className={inputError('title')}
              placeholder="Task title"
              {...form.register('title')}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Quick Duration</Label>
            <div className="flex gap-2 flex-wrap">
              {durationPresets.map((d) => (
                <Button
                  key={d.value}
                  type="button"
                  size="sm"
                  variant={durationMinutes === d.value ? 'default' : 'outline'}
                  onClick={() => setDuration(d.value)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start</Label>
              <Input
                className={inputError('startTime')}
                type="datetime-local"
                {...form.register('startTime')}
              />
              {errors.startTime && (
                <p className="text-xs text-red-500">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>End</Label>
              <Input
                className={inputError('endTime')}
                type="datetime-local"
                {...form.register('endTime')}
              />
              {errors.endTime && (
                <p className="text-xs text-red-500">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Duration: {formatTaskDuration(start, end)}
          </p>

          <div className="space-y-2">
            <Label>Notify Before</Label>
            <div className="flex gap-2 flex-wrap">
              {notifyPresets.map((p) => (
                <Button
                  key={p.value}
                  type="button"
                  size="sm"
                  variant={notifyValue === p.value ? 'default' : 'outline'}
                  disabled={durationMinutes > 0 && p.value >= durationMinutes}
                  onClick={() =>
                    setValue('notifyBeforeMinutes', p.value, {
                      shouldValidate: true,
                    })
                  }
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <Input
              className={inputError('notifyBeforeMinutes')}
              type="number"
              min={0}
              {...form.register('notifyBeforeMinutes', { valueAsNumber: true })}
            />
            {errors.notifyBeforeMinutes && (
              <p className="text-xs text-red-500">
                {errors.notifyBeforeMinutes.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={3} {...form.register('description')} />
          </div>

          <div className="flex items-center justify-between">
            <Label>Focus Session</Label>
            <Switch
              checked={form.watch('isFocusSession')}
              onCheckedChange={(v) => setValue('isFocusSession', v)}
            />
          </div>

          {overlapping.length > 0 && (
            <div className="p-3 rounded-md border border-yellow-600 dark:border-yellow-200 text-yellow-800 dark:text-yellow-400 text-sm flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5">
                <TriangleAlert className="h-4 w-4" /> Overlaps{' '}
                {overlapping.length} task(s)
              </span>
              <ul className="list-disc ml-4 text-xs space-y-0.5">
                {overlapping.map((t) => (
                  <li key={t.id}>{t.title}</li>
                ))}
              </ul>
            </div>
          )}

          {errors.root && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {errors.root.message}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Legend ─── */

function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {[
        { label: 'Scheduled', bg: '#f59e0b' },
        { label: 'Focus', bg: '#fbbf24' },
        { label: 'Completed', color: 'var(--chart-1)' },
        { label: 'Missed', color: 'var(--destructive)' },
      ].map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ background: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}

/* ─── Page ─── */

export function CalendarPage() {
  const { tasks: initialTasks } = Route.useLoaderData()
  const [tasks, setTasks] = useState<Array<LoadedTask>>(initialTasks)
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState(new Date())
  const [modal, setModal] = useState<{ open: boolean; start: Date; end: Date }>(
    {
      open: false,
      start: new Date(),
      end: addMinutes(new Date(), 25),
    },
  )

  const events = useMemo<Array<CalendarEvent>>(
    () =>
      tasks.map((t) => ({
        id: t.id,
        title: t.title,
        start: new Date(t.startTime),
        end: new Date(t.endTime),
        status: t.status,
        isFocusSession: t.isFocusSession,
        resource: t,
      })),
    [tasks],
  )

  const handleSelectSlot = useCallback(
    (slot: SlotInfo) => {
      const start = roundToNext5Minutes(slot.start)
      const defaultEnd =
        view === 'month'
          ? addMinutes(start, 25)
          : slot.end > slot.start
            ? slot.end
            : addMinutes(start, 25)
      setModal({ open: true, start, end: defaultEnd })
    },
    [view],
  )

  function handleTaskCreated(task: LoadedTask) {
    setTasks((prev) => [...prev, task])
  }

  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {format(date, 'MMMM yyyy')}
          </p>
          <h1 className="text-2xl font-bold mt-0.5">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Click any slot to schedule a task
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate({ to: '/add' })}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          New Task
        </Button>
      </div>

      <CalendarLegend />

      <div
        className="rounded-xl border bg-background shadow-sm p-4"
        style={{ height: '74vh' }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          components={{
            event: EventTile as any,
            toolbar: CustomToolbar,
          }}
          eventPropGetter={(event) => {
            const e = event
            const { bg } = statusColor(e.status, e.isFocusSession)
            return {
              style: {
                background: bg,
                border: 'none',
                borderRadius: '4px',
                padding: 0,
              },
            }
          }}
          dayPropGetter={(dayDate) => {
            const isToday =
              format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            return isToday
              ? { style: { background: 'hsl(var(--muted) / 0.3)' } }
              : {}
          }}
          formats={{
            timeGutterFormat: (dayDate, culture, l) =>
              l!.format(dayDate, 'h a', culture),
            eventTimeRangeFormat: () => '',
          }}
          popup
          showMultiDayTimes
          step={15}
          timeslots={4}
        />
      </div>

      {modal.open && (
        <TaskModal
          open={modal.open}
          defaultStart={modal.start}
          defaultEnd={modal.end}
          tasks={tasks}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
          onSuccess={handleTaskCreated}
        />
      )}
    </div>
  )
}
