import { addMinutes } from 'date-fns'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { roundToNext5, toInputDateTime } from './helpers'
import type { z } from 'zod'
import { taskSchema } from '@/zod/task-schema'
import { createOrUpdateTodo } from '@/action/create-update-task'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type TaskFormValues = z.infer<typeof taskSchema>

export function QuickAddModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const now = roundToNext5(new Date())

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
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
    formState: { isSubmitting, errors },
  } = form

  async function onSubmit(values: TaskFormValues) {
    await createOrUpdateTodo({
      data: {
        ...values,
        startTime: new Date(values.startTime),
        endTime: new Date(values.endTime),
      },
    })
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <Plus className="w-4 h-4" /> Quick Add Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-1">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Title
            </Label>
            <Input
              autoFocus
              placeholder="What needs to be done?"
              {...form.register('title')}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Start
              </Label>
              <Input type="datetime-local" {...form.register('startTime')} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                End
              </Label>
              <Input type="datetime-local" {...form.register('endTime')} />
              {errors.endTime && (
                <p className="text-xs text-red-500">{errors.endTime.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Focus Session
            </Label>
            <Switch
              checked={form.watch('isFocusSession')}
              onCheckedChange={(v) => form.setValue('isFocusSession', v)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
