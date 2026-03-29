import { createFileRoute, redirect } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'
import { getTasks } from '@/action/get-task'
import { checkRouteAuth } from '@/lib/route-access'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// Lazy load Insights component to defer loading heavy chart libraries
// Only loaded when user navigates to /insights route
const Insights = lazy(() =>
  import('@/components/insights').then((m) => ({ default: m.Insights })),
)

export const Route = createFileRoute('/insights')({
  beforeLoad: async () => {
    // Auth check - redirect to login if not authenticated
    const user = await checkRouteAuth()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    // Load tasks in parallel - prepared for future parallelization
    const [tasks] = await Promise.all([getTasks()])
    return { tasks }
  },
  component: InsightsPage,
  pendingComponent: LoadingSpinner,
})

function InsightsPage() {
  const { tasks } = Route.useLoaderData()
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Insights tasks={tasks} />
    </Suspense>
  )
}
