import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { getTasks } from '@/action/get-task'
import { checkRouteAuth } from '@/lib/route-access'
import { usePollOnVisible } from '@/hooks/usePollOnVisible'
import { useTasksByStatus } from '@/hooks/useTasksByStatus'
import TasksHeader from '@/components/Task/TasksHeader'
import TaskStats from '@/components/Task/TaskStats'
import TaskSection from '@/components/Task/TaskSection'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export const Route = createFileRoute('/tasks')({
  beforeLoad: async () => {
    // Auth check - redirect to login if not authenticated
    const user = await checkRouteAuth()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    // Load tasks in parallel - prepared for future parallelization
    const [tasks] = await Promise.all([getTasks()])
    return { tasks }
  },
  component: TasksPage,
  pendingComponent: LoadingSpinner,
})

function TasksPage() {
  const { tasks: initialTasks } = Route.useLoaderData()
  const [tasks, setTasks] = useState(initialTasks)

  // Poll data when page is visible - refresh tasks without invalidating all loaders
  usePollOnVisible(async () => {
    const refreshedTasks = await getTasks()
    setTasks(refreshedTasks)
  })

  // Categorize tasks by status
  const { today, upcoming, missed, completed, totalFocus } =
    useTasksByStatus(tasks)

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Header with title and date */}
      <TasksHeader />

      {/* Summary statistics */}
      <TaskStats
        total={tasks.length}
        today={today.length}
        completed={completed.length}
        focus={totalFocus}
      />

      {/* Task sections by status */}
      <TaskSection title="Today" tasks={today} />
      <TaskSection title="Upcoming" tasks={upcoming} collapsible />
      <TaskSection title="Missed" tasks={missed} collapsible />
      <TaskSection title="Completed" tasks={completed} collapsible />
    </div>
  )
}
