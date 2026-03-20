import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function CalendarSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="pt-6">
          {/* Calendar Header (Days of week) */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>

          {/* Calendar Body (Days) */}
          <div className="grid grid-cols-7 gap-1">
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
            ].map((i) => (
              <div key={i} className="aspect-square">
                <Skeleton className="h-full w-full rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Events/Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-96 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Today's tasks or details */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border rounded-md space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
