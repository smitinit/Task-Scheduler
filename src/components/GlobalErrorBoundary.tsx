import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function GlobalErrorBoundary({ error }: { error: any }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full text-center space-y-4">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            {error?.message ?? 'Unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </CardContent>
      </Card>
    </div>
  )
}
