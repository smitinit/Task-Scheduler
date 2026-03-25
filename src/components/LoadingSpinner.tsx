import { Loader } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}
