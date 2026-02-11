import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

/* ---------------- Card Skeleton ---------------- */

function TaskCardSkeleton() {
  return (
    <Card className="border">
      <CardContent className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-3/4" />

          <div className="flex gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>

        {/* Date line */}
        <Skeleton className="h-3 w-2/3" />

        {/* Focus badge */}
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  )
}

/* ---------------- Section Skeleton ---------------- */

function TaskSectionSkeleton({ titleWidth = 'w-20' }: { titleWidth?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className={`h-5 ${titleWidth}`} />
        <Skeleton className="h-4 w-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  )
}

/* ---------------- Page Skeleton ---------------- */

export function TasksPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>

        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="border border-border/40 bg-background shadow-sm"
          >
            <CardContent className="text-center space-y-2 py-6">
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Divider */}
      <div className="h-px bg-border" />
      {/* Sections */}
      <TaskSectionSkeleton titleWidth="w-16" /> {/* Today */}
      <TaskSectionSkeleton titleWidth="w-24" /> {/* Upcoming */}
      <TaskSectionSkeleton titleWidth="w-20" /> {/* Missed */}
      <TaskSectionSkeleton titleWidth="w-24" /> {/* Completed */}
    </div>
  )
}
