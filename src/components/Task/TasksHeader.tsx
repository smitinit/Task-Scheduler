import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function TasksHeader() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(), 'EEEE, MMM d')}
        </p>
      </div>

      <Button onClick={() => navigate({ to: '/' })}>+ Add Task</Button>
    </div>
  )
}
