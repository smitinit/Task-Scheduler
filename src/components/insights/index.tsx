import { useMemo } from 'react'
import { differenceInMinutes } from 'date-fns'
import { CheckCircle2, Clock, Flame, XCircle, Zap } from 'lucide-react'
import { ConsistencyHeatmap } from './ConsistencyHeatmap'
import { MetricCard } from './MetricCard'
import { minutesToHours, pct } from './utils'
import { WeeklyCompletionChart } from './WeeklyCompletionChart'
import { HourDistributionChart } from './HourDistributionChart'
import type { getTasks } from '@/action/get-task'

export type Task = Awaited<ReturnType<typeof getTasks>>[number]

export interface InsightsPageProps {
  tasks: Array<Task>
}

export function Insights({ tasks }: InsightsPageProps) {
  // calculate overall stats
  const overallStats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const missed = tasks.filter((t) => t.status === 'missed').length

    const totalMinutes = tasks
      .filter((t) => t.status === 'completed')
      .reduce(
        (acc, t) =>
          acc + differenceInMinutes(new Date(t.endTime), new Date(t.startTime)),
        0,
      )

    const avgDuration = completed > 0 ? Math.round(totalMinutes / completed) : 0

    return { total, completed, missed, totalMinutes, avgDuration }
  }, [tasks])

  if (tasks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center text-muted-foreground">
        <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <h2 className="text-lg font-semibold">No data yet</h2>
        <p className="text-sm mt-1">
          Start scheduling tasks and insights will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Behavior Intelligence
        </p>
        <h1 className="text-2xl font-bold mt-0.5">Insights</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Based on {overallStats.total} total tasks
        </p>
      </div>

      {/* Top-level metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Completion rate"
          value={`${pct(overallStats.completed, overallStats.total)}%`}
          icon={CheckCircle2}
          trend={
            pct(overallStats.completed, overallStats.total) >= 70
              ? 'up'
              : 'down'
          }
        />
        <MetricCard
          label="Total time tracked"
          value={minutesToHours(overallStats.totalMinutes)}
          icon={Clock}
        />
        <MetricCard
          label="Avg task duration"
          value={
            overallStats.avgDuration > 0 ? `${overallStats.avgDuration}m` : '—'
          }
          icon={Flame}
        />
        <MetricCard
          label="Miss rate"
          value={`${pct(overallStats.missed, overallStats.total)}%`}
          icon={XCircle}
          trend={
            pct(overallStats.missed, overallStats.total) <= 20 ? 'up' : 'down'
          }
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <ConsistencyHeatmap tasks={tasks} />
          <WeeklyCompletionChart tasks={tasks} />
        </div>
        <div className="space-y-10">
          <HourDistributionChart tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
