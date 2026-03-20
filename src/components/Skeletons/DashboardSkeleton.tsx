import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active and Next Task Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-2 pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline Section */}
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
