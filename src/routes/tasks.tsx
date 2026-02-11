import { createFileRoute, useRouter } from '@tanstack/react-router'
import { isToday } from 'date-fns'
import { useEffect } from 'react'
import { getTasks } from '@/action/get-task'
import TasksHeader from '@/components/Task/TasksHeader'
import TaskStats from '@/components/Task/TaskStats'
import TaskSection from '@/components/Task/TaskSection'

export const Route = createFileRoute('/tasks')({
  loader: async () => {
    const tasks = await getTasks()
    return { tasks }
  },
  component: TasksPage,
})

function TasksPage() {
  const { tasks } = Route.useLoaderData()

  // const router = useRouter()

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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     router.invalidate()
  //   }, 60000) // 1 minute

  //   return () => clearInterval(interval)
  // }, [])

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
