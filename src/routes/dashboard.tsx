import { createFileRoute } from '@tanstack/react-router'

import { getTasks } from '@/action/get-task'

import { authMiddleware } from '@/middleware/auth'

import DashboardPage from '@/components/pages/dashboard'

/* ── Types ── */

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const tasks = await getTasks()
    return { tasks }
  },
  component: DashboardPage,
  server: { middleware: [authMiddleware] },
})
