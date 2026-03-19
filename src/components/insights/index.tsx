import { useMemo } from 'react'
import { differenceInMinutes, format, getHours, startOfWeek } from 'date-fns'
import {
  CheckCircle2,
  Clock,
  Flame,
  Moon,
  Sun,
  Sunrise,
  XCircle,
  Zap,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ConsistencyHeatmap } from './ConsistencyHeatmap'
import { InsightCallout } from './InsightCallout'
import { MetricCard } from './MetricCard'
import { SectionHeader } from './SectionHeader'
import { getTimeOfDay, minutesToHours, pct } from './utils'
import type {
  HourDataPoint,
  InsightEntry,
  TimeOfDay,
  TimeSlotData,
  WeekDataPoint,
} from './types'
import type { getTasks } from '@/action/get-task'
import { ChartTooltipContent } from '@/components/ui/chart'

export type Task = Awaited<ReturnType<typeof getTasks>>[number]

const TIME_OF_DAY_CONFIG: Record<
  TimeOfDay,
  { label: string; icon: React.ElementType; range: string }
> = {
  morning: { label: 'Morning', icon: Sunrise, range: '5 – 12am' },
  afternoon: { label: 'Afternoon', icon: Sun, range: '12 – 5pm' },
  evening: { label: 'Evening', icon: Moon, range: '5 – 9pm' },
  night: { label: 'Night', icon: Moon, range: '9pm +' },
}

/* ── Weekly Completion Chart ── */

function WeeklyCompletionChart({ tasks }: { tasks: Array<Task> }) {
  const today = new Date()
  const weekStart = startOfWeek(today)

  const weekData = useMemo<Array<WeekDataPoint>>(() => {
    const data: Array<WeekDataPoint> = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(day.getDate() + i)
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayLabel = format(day, 'E')

      const dayTasks = tasks.filter(
        (t) => format(new Date(t.startTime), 'yyyy-MM-dd') === dayStr,
      )
      const completed = dayTasks.filter((t) => t.status === 'completed').length
      const missed = dayTasks.filter((t) => t.status === 'missed').length
      const scheduled = dayTasks.length

      data.push({
        label: dayLabel,
        scheduled,
        completed,
        missed,
      })
    }

    return data
  }, [tasks])

  return (
    <div>
      <SectionHeader
        title="Weekly Completion"
        subtitle="This week's tasks by day"
      />
      <div className="rounded-lg border bg-card p-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              content={({ active, payload }) => (
                <ChartTooltipContent active={active} payload={payload} />
              )}
            />
            <Bar
              dataKey="scheduled"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="completed"
              fill="hsl(var(--primary) / 0.6)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="missed"
              fill="hsl(var(--destructive))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Time of Day Breakdown ── */

function TimeOfDayBreakdown({ tasks }: { tasks: Array<Task> }) {
  const breakdown = useMemo(() => {
    const result: Record<TimeOfDay, TimeSlotData> = {
      morning: { scheduled: 0, completed: 0, missed: 0 },
      afternoon: { scheduled: 0, completed: 0, missed: 0 },
      evening: { scheduled: 0, completed: 0, missed: 0 },
      night: { scheduled: 0, completed: 0, missed: 0 },
    }

    tasks.forEach((t) => {
      const timeOfDay = getTimeOfDay(new Date(t.startTime))
      result[timeOfDay].scheduled++
      if (t.status === 'completed') result[timeOfDay].completed++
      if (t.status === 'missed') result[timeOfDay].missed++
    })

    return result
  }, [tasks])

  return (
    <div>
      <SectionHeader
        title="Time of Day Breakdown"
        subtitle="Performance across dayparts"
      />
      <div className="space-y-3">
        {(Object.entries(breakdown) as Array<[TimeOfDay, TimeSlotData]>).map(
          ([period, data]) => {
            const config = TIME_OF_DAY_CONFIG[period]
            const Icon = config.icon
            const rate =
              data.scheduled > 0
                ? Math.round((data.completed / data.scheduled) * 100)
                : 0

            return (
              <div
                key={period}
                className="rounded-lg border bg-card p-3 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none mb-1">
                    {config.label}{' '}
                    <span className="text-muted-foreground text-xs">
                      ({config.range})
                    </span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{data.scheduled} scheduled</span>
                    <span>·</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {data.completed} completed
                    </span>
                    <span>·</span>
                    <span className="text-red-600 dark:text-red-400">
                      {data.missed} missed
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 to-emerald-400"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          },
        )}
      </div>
    </div>
  )
}

/* ── Hour Distribution Chart ── */

function HourDistributionChart({ tasks }: { tasks: Array<Task> }) {
  const data = useMemo<Array<HourDataPoint>>(() => {
    const result: Array<HourDataPoint> = []

    for (let h = 0; h < 24; h++) {
      const hourLabel =
        h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`
      const hourTasks = tasks.filter(
        (t) => getHours(new Date(t.startTime)) === h,
      )
      const scheduled = hourTasks.length
      const completed = hourTasks.filter((t) => t.status === 'completed').length

      result.push({
        hour: `${h}:00`,
        label: hourLabel,
        scheduled,
        completed,
      })
    }

    return result
  }, [tasks])

  return (
    <div>
      <SectionHeader
        title="Hour Distribution"
        subtitle="Task scheduling by hour of day"
      />
      <div className="rounded-lg border bg-card p-4">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary) / 0.5)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary) / 0.5)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip
              content={({ active, payload }) => (
                <ChartTooltipContent active={active} payload={payload} />
              )}
            />
            <Area
              type="monotone"
              dataKey="scheduled"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorScheduled)"
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="hsl(var(--primary) / 0.6)"
              fillOpacity={1}
              fill="url(#colorCompleted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Focus Analytics ── */

function FocusAnalytics({ tasks }: { tasks: Array<Task> }) {
  const stats = useMemo(() => {
    const focusTasks = tasks.filter((t) => t.isFocusSession)
    const focusCompleted = focusTasks.filter(
      (t) => t.status === 'completed',
    ).length
    const focusMissed = focusTasks.filter((t) => t.status === 'missed').length

    const focusMinutes = focusTasks
      .filter((t) => t.status === 'completed')
      .reduce(
        (acc, t) =>
          acc + differenceInMinutes(new Date(t.endTime), new Date(t.startTime)),
        0,
      )

    const rate =
      focusTasks.length > 0
        ? Math.round((focusCompleted / focusTasks.length) * 100)
        : 0

    return {
      total: focusTasks.length,
      completed: focusCompleted,
      missed: focusMissed,
      minutes: focusMinutes,
      rate,
    }
  }, [tasks])

  if (stats.total === 0) {
    return (
      <div>
        <SectionHeader
          title="Focus Analytics"
          subtitle="Focus session insights"
        />
        <div className="rounded-lg border border-dashed bg-card/50 p-6 text-center text-muted-foreground">
          <p className="text-sm">No focus sessions logged yet</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader
        title="Focus Analytics"
        subtitle="Focus session insights"
      />
      <div className="space-y-3">
        <MetricCard
          label="Focus sessions"
          value={stats.total}
          icon={Flame}
          accent="bg-orange-500/10 text-orange-500"
        />
        <MetricCard
          label="Completion rate"
          value={`${stats.rate}%`}
          icon={CheckCircle2}
          accent="bg-emerald-500/10 text-emerald-500"
          trend={stats.rate >= 70 ? 'up' : 'down'}
        />
        <MetricCard
          label="Total focus time"
          value={minutesToHours(stats.minutes)}
          icon={Clock}
          accent="bg-blue-500/10 text-blue-500"
        />
      </div>
    </div>
  )
}

/* ── Miss Patterns ── */

function MissPatterns({ tasks }: { tasks: Array<Task> }) {
  const insights = useMemo<Array<InsightEntry>>(() => {
    const results: Array<InsightEntry> = []

    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const missed = tasks.filter((t) => t.status === 'missed').length

    if (missed > 0) {
      const missRate = pct(missed, total)
      switch (true) {
        case missRate >= 60:
          results.push({
            type: 'warning',
            message: `${missRate}% miss rate is high. Review your scheduling realism.`,
          })
          break
        case missRate >= 40:
          results.push({
            type: 'warning',
            message: `${missRate}% miss rate. Consider scheduling buffers.`,
          })
          break
        case missRate >= 20:
          results.push({
            type: 'info',
            message: `${missRate}% miss baseline. Optimize by time-blocking.`,
          })
          break
      }
    }

    const overallMissRate = pct(missed, total)
    if (overallMissRate <= 20 && completed >= 5) {
      results.push({
        type: 'success',
        message: `Only ${overallMissRate}% miss rate. Your scheduling is highly accurate.`,
      })
    }

    const focusTotal = tasks.filter((t) => t.isFocusSession).length
    const focusMissed = tasks.filter(
      (t) => t.isFocusSession && t.status === 'missed',
    ).length
    if (focusTotal >= 3 && pct(focusMissed, focusTotal) >= 50) {
      results.push({
        type: 'warning',
        message: `${pct(focusMissed, focusTotal)}% of focus sessions are missed. Protect these blocks — block distractions.`,
      })
    }

    const lateTotal = tasks.filter(
      (t) => getHours(new Date(t.startTime)) >= 21,
    ).length
    const lateMissed = tasks.filter(
      (t) => getHours(new Date(t.startTime)) >= 21 && t.status === 'missed',
    ).length
    if (lateTotal >= 3 && pct(lateMissed, lateTotal) >= 60) {
      results.push({
        type: 'warning',
        message: `${pct(lateMissed, lateTotal)}% of tasks after 9 PM are missed. Night scheduling isn't working for you.`,
      })
    }

    if (results.length === 0) {
      results.push({
        type: 'info',
        message: 'Keep scheduling consistently to unlock pattern insights.',
      })
    }

    return results
  }, [tasks])

  return (
    <div>
      <SectionHeader
        title="Behavior Insights"
        subtitle="Pattern detection from your scheduling history"
      />
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <InsightCallout
            key={i}
            type={insight.type}
            message={insight.message}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Main Insights Component ── */

export interface InsightsPageProps {
  tasks: Array<Task>
}

export function Insights({ tasks }: InsightsPageProps) {
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Completion rate"
          value={`${pct(overallStats.completed, overallStats.total)}%`}
          icon={CheckCircle2}
          accent="bg-emerald-500/10 text-emerald-500"
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
          accent="bg-blue-500/10 text-blue-500"
        />
        <MetricCard
          label="Avg task duration"
          value={
            overallStats.avgDuration > 0 ? `${overallStats.avgDuration}m` : '—'
          }
          icon={Flame}
          accent="bg-primary/10 text-primary"
        />
        <MetricCard
          label="Miss rate"
          value={`${pct(overallStats.missed, overallStats.total)}%`}
          icon={XCircle}
          accent="bg-destructive/10 text-destructive"
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
          <TimeOfDayBreakdown tasks={tasks} />
        </div>
        <div className="space-y-10">
          <HourDistributionChart tasks={tasks} />
          <FocusAnalytics tasks={tasks} />
          <MissPatterns tasks={tasks} />
        </div>
      </div>
    </div>
  )
}
