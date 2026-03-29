import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { format, isSameDay } from 'date-fns'
import { useTransition } from 'react'
import { Loader, Trash2 } from 'lucide-react'
import { checkRouteAuth } from '@/lib/route-access'
import { LoadingSpinner } from '@/components/LoadingSpinner'

import { getTaskById } from '@/action/get-task-by-id'
import { deleteTask } from '@/action/delete-task'
import { markTaskCompletion } from '@/action/complete-task'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/task/$taskId')({
  beforeLoad: async () => {
    // Auth check - redirect to login if not authenticated
    const user = await checkRouteAuth()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async ({ params }) => {
    const id = Number(params.taskId)

    if (isNaN(id) || id <= 0) {
      return { task: null }
    }

    const task = await getTaskById({ data: { id } })
    return { task }
  },
  component: TaskDetailPage,
  pendingComponent: LoadingSpinner,
})

function TaskDetailPage() {
  const navigate = useNavigate()
  const { task } = Route.useLoaderData()
  const [isPending, startTransition] = useTransition()

  if (!task) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">Task not found</h1>
        <p className="text-sm text-muted-foreground">
          This task doesn't exist or has been deleted.
        </p>
        <Button size="sm" onClick={() => navigate({ to: '/tasks' })}>
          Back to Tasks
        </Button>
      </div>
    )
  }

  const start = new Date(task.startTime)
  const end = new Date(task.endTime)
  const sameDay = isSameDay(start, end)
  const isCompleted = task.status === 'completed'

  function handleDelete() {
    startTransition(async () => {
      await deleteTask({ data: { id: task!.id } })
      navigate({ to: '/tasks' })
    })
  }

  function handleMarkComplete() {
    startTransition(async () => {
      await markTaskCompletion({ data: { id: task!.id } })
      navigate({ to: '/tasks' })
    })
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Task Details
          </p>
          <h1 className="text-2xl font-bold mt-0.5">{task.title}</h1>
        </div>

        <div className="flex gap-2">
          {!isCompleted && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleMarkComplete}
              disabled={isPending}
            >
              {isPending ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                'Mark Complete'
              )}
            </Button>
          )}

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            {isPending ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
              </>
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Timeline Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Time */}
          <div>
            <div className="text-sm text-muted-foreground">Scheduled Time</div>
            <div className="text-base font-medium">
              {sameDay ? (
                <>
                  {format(start, 'MMM d')} · {format(start, 'p')} -{' '}
                  {format(end, 'p')}
                </>
              ) : (
                <>
                  {format(start, 'MMM d · p')} → {format(end, 'MMM d · p')}
                </>
              )}
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${
                isCompleted ? 'bg-green-500' : 'bg-primary'
              }`}
              style={{ width: '100%' }}
            />
          </div>

          {/* Notification */}
          <div>
            <div className="text-sm text-muted-foreground">Notification</div>
            <div className="text-base font-medium">
              {task.notifyBeforeMinutes >= 60
                ? `${task.notifyBeforeMinutes / 60}h before`
                : `${task.notifyBeforeMinutes}m before`}
            </div>
          </div>

          {/* Focus */}
          {task.isFocusSession && (
            <div className="text-blue-600 font-medium">Focus Session</div>
          )}

          {/* Description */}
          {task.description && (
            <div>
              <div className="text-sm text-muted-foreground">Description</div>
              <div className="text-base">{task.description}</div>
            </div>
          )}

          {/* Status */}
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="capitalize font-medium">{task.status}</div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={() => navigate({ to: '/tasks' })} variant={'outline'}>
          Back
        </Button>
      </div>
    </div>
  )
}
