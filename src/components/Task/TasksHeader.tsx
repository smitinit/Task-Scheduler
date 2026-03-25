import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TasksHeader() {
  const navigate = useNavigate()

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {format(new Date(), 'EEEE · MMMM d, yyyy')}
        </p>
        <h1 className="text-2xl font-bold mt-0.5">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Organize and track all your tasks
        </p>
      </div>

      <Button
        size="sm"
        onClick={() => navigate({ to: '/add' })}
        className="gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Task
      </Button>
    </div>
  )
}
