import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TaskFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      {/* Title */}
      <Skeleton className="h-7 w-40" />

      <div className="space-y-6">
        <Tabs defaultValue="quick">
          <TabsList>
            <TabsTrigger value="quick" disabled>
              Quick
            </TabsTrigger>
            <TabsTrigger value="advanced" disabled>
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* QUICK TAB */}
          <TabsContent value="quick" className="space-y-6 mt-6">
            {/* Title input */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Duration presets */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>

            {/* DateTime Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Duration text */}
            <Skeleton className="h-4 w-32" />

            {/* Notify Section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-9 w-16 rounded-md" />
                <Skeleton className="h-9 w-16 rounded-md" />
                <Skeleton className="h-9 w-16 rounded-md" />
                <Skeleton className="h-9 w-16 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>

              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-4 w-36" />
          </TabsContent>

          {/* ADVANCED TAB */}
          <TabsContent value="advanced" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  )
}
