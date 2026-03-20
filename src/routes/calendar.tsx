import { createFileRoute } from '@tanstack/react-router'
import { getTasksForForm } from '@/action/get-tasks-for-form'
import { CalendarPage } from '@/components/calendar/Calendar'
import { CalendarSkeleton } from '@/components/Skeletons'
import { authMiddleware } from '@/middleware/auth'
import 'react-big-calendar/lib/css/react-big-calendar.css'

export const Route = createFileRoute('/calendar')({
  loader: async () => {
    const tasks = await getTasksForForm()
    return { tasks }
  },
  component: CalendarPage,
  pendingComponent: CalendarSkeleton,
  server: {
    middleware: [authMiddleware],
  },
})
