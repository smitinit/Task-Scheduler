import { createFileRoute } from '@tanstack/react-router'
import { Insights } from '@/components/insights'
import { getTasks } from '@/action/get-task'
import { authMiddleware } from '@/middleware/auth'

/* ── Route ── */

export const Route = createFileRoute('/insights')({
  loader: async () => {
    const tasks = await getTasks()
    return { tasks }
  },
  component: InsightsPage,
  server: { middleware: [authMiddleware] },
})

/* ── Page ── */

function InsightsPage() {
  const { tasks } = Route.useLoaderData()
  return <Insights tasks={tasks} />
}
