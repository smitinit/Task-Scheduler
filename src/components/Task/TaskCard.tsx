import { format, isSameDay } from 'date-fns'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { Check, Loader, Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import type { ServerTaskInput } from '@/zod/server-task-schema'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatTaskDuration } from '@/routes'
import { toggleTaskCompletion } from '@/action/complete-task'
import { deleteTask } from '@/action/delete-task'

type Props = {
  task: ServerTaskInput
}

export default function TaskCard({ task }: Props) {
  const navigate = useNavigate()
  const router = useRouter()
  const duration = formatTaskDuration(
    task.startTime.toISOString(),
    task.endTime.toISOString(),
  )

  const isMultiDay = !isSameDay(task.startTime, task.endTime)
  const isCompleted = task.status === 'completed'

  const [isPending, startTransition] = useTransition()
  function handleCompleteTask() {
    startTransition(async () => {
      await toggleTaskCompletion({ data: { id: task.id! } })
      router.invalidate()
    })
  }
  function handleDeleteTask() {
    startTransition(async () => {
      await deleteTask({ data: { id: task.id! } })
      router.invalidate()
    })
  }
  return (
    <Card
      onClick={() => navigate({ to: `/task/${task.id}` })}
      className={cn(
        'relative group cursor-pointer transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-1 border',
        task.status === 'scheduled' && 'border-l-[3px] border-l-blue-500/80',
        task.status === 'missed' && 'border-l-[3px] border-l-red-500/80',
        isCompleted &&
          'opacity-60 border-l-[3px] grayscale-20 border-l-green-500/80',
      )}
    >
      <CardContent className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3
            className={cn(
              'font-medium text-sm line-clamp-2',
              isCompleted && 'line-through',
            )}
          >
            {task.title}
          </h3>

          <div className="flex gap-2">
            {!isCompleted && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-600"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCompleteTask()
                }}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className="animate-spin" size={14} />
                ) : (
                  <Check size={14} className="text-green-500" />
                )}
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteTask()
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader className="animate-spin" size={14} />
              ) : (
                <Trash2 size={14} />
              )}
            </Button>
          </div>
        </div>

        {/* Date & Time */}
        <div className="text-xs text-muted-foreground">
          {isMultiDay ? (
            <>
              {format(task.startTime, 'MMM d, p')} →{' '}
              {format(task.endTime, 'MMM d, p')} · {duration}
            </>
          ) : (
            <>
              {format(task.startTime, 'MMM d')} · {format(task.startTime, 'p')}{' '}
              - {format(task.endTime, 'p')} · {duration}
            </>
          )}
        </div>

        {/* Focus */}
        {task.isFocusSession && (
          <div className="text-xs text-blue-500 font-medium">Focus Session</div>
        )}
      </CardContent>
    </Card>
  )
}
