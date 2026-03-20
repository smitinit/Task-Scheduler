import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function TaskDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-md" />
          <Skeleton className="h-10 w-20 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Title */}
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>

              {/* Description */}
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-32" />

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
