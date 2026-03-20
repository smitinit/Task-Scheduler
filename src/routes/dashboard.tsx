import { createFileRoute } from '@tanstack/react-router'

import { getTasks } from '@/action/get-task'

import { authMiddleware } from '@/middleware/auth'
import { DashboardSkeleton } from '@/components/Skeletons'

import DashboardPage from '@/components/dashboard/dashboard'

/* ── Types ── */

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const tasks = await getTasks()
    return { tasks }
  },
  component: DashboardPage,
  pendingComponent: DashboardSkeleton,
  server: { middleware: [authMiddleware] },
})
