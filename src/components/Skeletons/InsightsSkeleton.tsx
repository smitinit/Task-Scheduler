import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function InsightsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8 px-4">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-60" />
      </div>

      {/* Callout/Info Box */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Weekly Completion Chart */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-64 w-full rounded-md" />
          </CardContent>
        </Card>

        {/* Hour Distribution Chart */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-64 w-full rounded-md" />
          </CardContent>
        </Card>

        {/* Time of Day Distribution */}
        <div>
          <div className="mb-4">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6 space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-32 w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Consistency Heatmap */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                    <Skeleton key={j} className="h-6 w-6 rounded-md flex-1" />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
