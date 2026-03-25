import { createFileRoute, redirect } from '@tanstack/react-router'
import { getTasksForForm } from '@/action/get-tasks-for-form'
import { checkRouteAuth } from '@/lib/auth-check'
import { CalendarPage } from '@/components/calendar/Calendar'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import 'react-big-calendar/lib/css/react-big-calendar.css'

export const Route = createFileRoute('/calendar')({
  beforeLoad: async () => {
    // Auth check - redirect to login if not authenticated
    const user = await checkRouteAuth()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    // Load tasks in parallel - prepared for future parallelization
    const [tasks] = await Promise.all([getTasksForForm()])
    return { tasks }
  },
  component: CalendarPage,
  pendingComponent: LoadingSpinner,
})
