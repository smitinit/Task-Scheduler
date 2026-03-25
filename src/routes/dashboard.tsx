import { createFileRoute, redirect } from '@tanstack/react-router'
import { getTasks } from '@/action/get-task'
import { checkRouteAuth } from '@/lib/auth-check'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import DashboardPage from '@/components/dashboard/dashboard'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    // Auth check - redirect to login if not authenticated
    const user = await checkRouteAuth()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    // Load tasks in parallel with minimal overhead
    // Auth is already verified in beforeLoad, getTasks verifies again but that's cached per-request
    const [tasks] = await Promise.all([getTasks()])
    return { tasks }
  },
  component: DashboardPage,
  pendingComponent: LoadingSpinner,
})
