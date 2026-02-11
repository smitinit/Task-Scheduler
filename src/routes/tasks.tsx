import { createFileRoute, useRouter } from '@tanstack/react-router'
import { isToday } from 'date-fns'
import { useEffect } from 'react'
import { getTasks } from '@/action/get-task'
import TasksHeader from '@/components/Task/TasksHeader'
import TaskStats from '@/components/Task/TaskStats'
import TaskSection from '@/components/Task/TaskSection'
import { authMiddleware } from '@/middleware/auth'
import { TasksPageSkeleton } from '@/components/Skeletons/TasksSkeleton'

export const Route = createFileRoute('/tasks')({
  loader: async () => {
    const tasks = await getTasks()
    return { tasks }
  },
  component: TasksPage,
  pendingComponent: TasksPageSkeleton,
  server: {
    middleware: [authMiddleware],
  },
})

function TasksPage() {
  const { tasks } = Route.useLoaderData()

  const router = useRouter()

  const now = new Date()

  const todayTasks = tasks.filter(
    (t) => isToday(t.startTime) && t.status === 'scheduled',
  )

  const upcomingTasks = tasks.filter(
    (t) =>
      !isToday(t.startTime) && t.startTime > now && t.status === 'scheduled',
  )

  const missedTasks = tasks.filter((t) => t.status === 'missed')

  const completedTasks = tasks.filter((t) => t.status === 'completed')

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    function start() {
      interval = setInterval(() => {
        router.invalidate()
      }, 60_000)
    }

    function stop() {
      if (interval) clearInterval(interval)
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        start()
      } else {
        stop()
      }
    }

    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [router])

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <TasksHeader />

      <TaskStats
        total={tasks.length}
        today={todayTasks.length}
        completed={completedTasks.length}
        focus={tasks.filter((t) => t.isFocusSession).length}
      />

      <div className="h-px bg-border" />

      <TaskSection title="Today" tasks={todayTasks} />
      <TaskSection title="Upcoming" tasks={upcomingTasks} collapsible />
      <TaskSection title="Missed" tasks={missedTasks} collapsible />
      <TaskSection title="Completed" tasks={completedTasks} collapsible />
    </div>
  )
}
