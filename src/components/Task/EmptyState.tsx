import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function EmptyState() {
  const navigate = useNavigate()

  return (
    <div className="text-center py-20 space-y-4">
      <p className="text-muted-foreground">No tasks yet.</p>
      <Button onClick={() => navigate({ to: '/' })}>
        Create Your First Task
      </Button>
    </div>
  )
}
