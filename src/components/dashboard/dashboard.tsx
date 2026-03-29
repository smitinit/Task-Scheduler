import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLoaderData } from '@tanstack/react-router'
import {
  addMinutes,
  differenceInMinutes,
  format,
  isToday,
  isWithinInterval,
} from 'date-fns'
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Flame,
  Plus,
  RefreshCw,
  XCircle,
  Zap,
} from 'lucide-react'
import type { Task } from '@/types/task'
import { formatCountdown, roundToNext5 } from '@/components/dashboard/helpers'
import { getTasks } from '@/action/get-task'
import { markTaskCompletion } from '@/action/complete-task'
import { createOrUpdateTodo } from '@/action/create-update-task'
import { Button } from '@/components/ui/button'
import { QuickAddModal } from '@/components/dashboard/QuickAddModal'
import { TimelineItem } from '@/components/dashboard/TimelineItem'
import { StatCard } from '@/components/dashboard/StatCard'
import { ActiveTaskWidget } from '@/components/dashboard/ActiveTaskWidget'
import { NextTaskWidget } from '@/components/dashboard/NextTaskWidget'

export default function DashboardPage() {
  const { tasks: initialTasks, serverNowIso } = useLoaderData({
    from: '/dashboard',
  })
  const initialNow = useMemo(() => new Date(serverNowIso), [serverNowIso])
  const [tasks, setTasks] = useState<Array<Task>>(initialTasks as Array<Task>)
  const [now, setNow] = useState(initialNow)
  const [showAdd, setShowAdd] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Use a ref for current time to avoid unnecessary re-renders
  // Only update state at strategic points or when tasks change
  const nowRef = useRef(initialNow)

  // Update time reference every second, but don't trigger re-renders
  // Only re-render when minute changes or active task might change
  useEffect(() => {
    const id = setInterval(() => {
      const newNow = new Date()
      const oldMinute = nowRef.current.getMinutes()
      const newMinute = newNow.getMinutes()

      // Only update state when minute changes (less frequent re-renders)
      if (oldMinute !== newMinute) {
        setNow(newNow)
      }

      nowRef.current = newNow
    }, 1000)

    return () => clearInterval(id)
  }, [])

  // filter tasks for today
  const todayTasks = useMemo<Array<Task>>(
    () => tasks.filter((t) => isToday(new Date(t.startTime))),
    [tasks],
  )

  // get the currently active task (if any)
  const activeTask = useMemo<Task | null>(
    () =>
      todayTasks.find(
        (t) =>
          t.status === 'scheduled' &&
          isWithinInterval(now, {
            start: new Date(t.startTime),
            end: new Date(t.endTime),
          }),
      ) ?? null,
    [todayTasks, now],
  )

  // get the next upcoming task (if any)
  const nextTask = useMemo<Task | null>(
    () =>
      todayTasks
        .filter((t) => t.status === 'scheduled' && new Date(t.startTime) > now)
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        )[0] ?? null,
    [todayTasks, now],
  )

  // calculate stats for today
  const stats = useMemo(
    () => ({
      total: todayTasks.length,
      completed: todayTasks.filter((t) => t.status === 'completed').length,
      missed: todayTasks.filter((t) => t.status === 'missed').length,
      focus: todayTasks.filter((t) => t.isFocusSession).length,
    }),
    [todayTasks],
  )

  // find missed tasks (started in the past but not completed)
  const missedTasks = useMemo<Array<Task>>(
    () => tasks.filter((t) => t.status === 'missed'),
    [tasks],
  )

  // sort today's tasks by start time for the timeline
  const timelineItems = useMemo<Array<Task>>(
    () =>
      [...todayTasks].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      ),
    [todayTasks],
  )

  // handlers
  async function handleComplete(id: number) {
    await markTaskCompletion({ data: { id } })
    // Refetch tasks to get updated state instead of manual mutation
    setTasks((await getTasks()) as Array<Task>)
  }

  async function handleReschedule(task: Task) {
    const start = roundToNext5(new Date())
    const duration = differenceInMinutes(
      new Date(task.endTime),
      new Date(task.startTime),
    )
    await createOrUpdateTodo({
      data: {
        id: task.id,
        title: task.title,
        description: task.description ?? undefined,
        startTime: start,
        endTime: addMinutes(start, duration),
        notifyBeforeMinutes: task.notifyBeforeMinutes,
        isFocusSession: task.isFocusSession,
      },
    })
    setTasks((await getTasks()) as Array<Task>)
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {format(now, 'EEEE · MMMM d, yyyy')}
          </p>
          <h1 className="text-2xl font-bold mt-0.5">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeTask
              ? `Active: ${activeTask.title}`
              : nextTask
                ? `Next up in ${formatCountdown(
                    new Date(nextTask.startTime).getTime() - now.getTime(),
                  )}`
                : 'No tasks running'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              setIsRefreshing(true)
              await getTasks().then((newTasks) =>
                setTasks(newTasks as Array<Task>),
              )
              setIsRefreshing(false)
            }}
            className="gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button asChild size="sm" className="gap-1.5">
            <Link to="/add">
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Live status row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ActiveTaskWidget task={activeTask} now={now} />
        <NextTaskWidget task={nextTask} now={now} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Tasks"
          value={stats.total}
          icon={CalendarClock}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
        />
        <StatCard label="Missed" value={stats.missed} icon={XCircle} />
        <StatCard label="Focus Sessions" value={stats.focus} icon={Zap} />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today Timeline */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Today's Timeline
            </h2>
            <span
              className="font-mono text-xs text-muted-foreground tabular-nums"
              suppressHydrationWarning
            >
              {format(now, 'HH:mm:ss')}
            </span>
          </div>

          {timelineItems.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <CalendarClock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No tasks scheduled for today</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShowAdd(true)}
              >
                Schedule something
              </Button>
            </div>
          ) : (
            <div className="space-y-0">
              {timelineItems.map((task) => (
                <TimelineItem
                  key={task.id}
                  task={task}
                  now={now}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Missed Tasks */}
          {missedTasks.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Missed · Reschedule
              </h2>
              <div className="space-y-2">
                {missedTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {task.title}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        {format(new Date(task.startTime), 'MMM d · HH:mm')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs shrink-0 text-amber-600 hover:text-amber-700"
                      onClick={() => handleReschedule(task)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-sm"
              >
                <Link to="/add">
                  <Plus className="w-4 h-4" />
                  Add Task
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-sm"
                onClick={() => setShowAdd(true)}
              >
                <Plus className="w-4 h-4" />
                Quick Task
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-sm"
                onClick={async () => {
                  const start = roundToNext5(new Date())
                  await createOrUpdateTodo({
                    data: {
                      title: 'Focus Session',
                      description: undefined,
                      startTime: start,
                      endTime: addMinutes(start, 25),
                      notifyBeforeMinutes: 2,
                      isFocusSession: true,
                    },
                  })
                  setTasks((await getTasks()) as Array<Task>)
                }}
              >
                <Flame className="w-4 h-4 text-indigo-500" />
                Start 25m Focus
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-sm"
              >
                <Link to="/calendar">
                  <CalendarClock className="w-4 h-4" />
                  Open Calendar
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2 h-9 text-sm"
              >
                <Link to="/tasks">
                  <CheckCircle2 className="w-4 h-4" />
                  All Tasks
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <QuickAddModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={async () => setTasks((await getTasks()) as Array<Task>)}
      />
    </div>
  )
}
