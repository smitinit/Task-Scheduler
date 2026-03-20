import { createFileRoute } from '@tanstack/react-router'
import { getTasks } from '@/action/get-task'
import { authMiddleware } from '@/middleware/auth'
import { usePollOnVisible } from '@/hooks/usePollOnVisible'
import { useTasksByStatus } from '@/hooks/useTasksByStatus'
import TasksHeader from '@/components/Task/TasksHeader'
import TaskStats from '@/components/Task/TaskStats'
import TaskSection from '@/components/Task/TaskSection'
import { TasksPageSkeleton } from '@/components/Skeletons/TasksSkeleton'

export const Route = createFileRoute('/tasks')({
  loader: async () => {
    const tasks = await getTasks()
    return { tasks }
  },
  component: TasksPage,
  pendingComponent: TasksPageSkeleton,
  server: { middleware: [authMiddleware] },
})

function TasksPage() {
  const { tasks } = Route.useLoaderData()

  // Poll data when page is visible
  usePollOnVisible()

  // Categorize tasks by status
  const { today, upcoming, missed, completed, totalFocus } =
    useTasksByStatus(tasks)

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      {/* Header with title and date */}
      <TasksHeader />

      {/* Summary statistics */}
      <TaskStats
        total={tasks.length}
        today={today.length}
        completed={completed.length}
        focus={totalFocus}
      />

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Task sections by status */}
      <TaskSection title="Today" tasks={today} />
      <TaskSection title="Upcoming" tasks={upcoming} collapsible />
      <TaskSection title="Missed" tasks={missed} collapsible />
      <TaskSection title="Completed" tasks={completed} collapsible />
    </div>
  )
}
