import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format, isSameDay } from 'date-fns'
import { useTransition } from 'react'
import { Loader, Trash2 } from 'lucide-react'

import { getTaskById } from '@/action/get-task-by-id'
import { deleteTask } from '@/action/delete-task'
import { markTaskCompletion } from '@/action/complete-task'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/task/$taskId')({
  loader: async ({ params }) => {
    const id = Number(params.taskId)

    if (isNaN(id) || id <= 0) {
      return { task: null }
    }

    const task = await getTaskById({ data: { id } })
    return { task }
  },
  component: TaskDetailPage,
})

function TaskDetailPage() {
  const navigate = useNavigate()
  const { task } = Route.useLoaderData()
  const [isPending, startTransition] = useTransition()

  if (!task) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Task not found</h1>
        <Button onClick={() => navigate({ to: '/tasks' })}>
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
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{task.title}</h1>

        <div className="flex gap-2">
          {!isCompleted && (
            <Button
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
