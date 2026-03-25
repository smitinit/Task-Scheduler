import React, { useMemo } from 'react'
import { endOfWeek, startOfWeek, subWeeks } from 'date-fns'
import { useTheme } from 'next-themes'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionHeader } from './SectionHeader'
import type { Task, WeekDataPoint } from './types'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

interface WeeklyCompletionChartProps {
  tasks: Array<Task>
}

export const WeeklyCompletionChart: React.FC<WeeklyCompletionChartProps> = ({
  tasks,
}) => {
  const { theme } = useTheme()

  const weeks = useMemo<Array<WeekDataPoint>>(() => {
    const today = new Date()
    const result: Array<WeekDataPoint> = []
    for (let i = 5; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(today, i))
      const weekEnd = endOfWeek(weekStart)
      const weekTasks = tasks.filter((t) => {
        const d = new Date(t.startTime)
        return d >= weekStart && d <= weekEnd
      })
      result.push({
        label: i === 0 ? 'This wk' : `${i}w ago`,
        scheduled: weekTasks.length,
        completed: weekTasks.filter((t) => t.status === 'completed').length,
        missed: weekTasks.filter((t) => t.status === 'missed').length,
      })
    }
    return result
  }, [tasks])

  const isDark = theme === 'dark'
  const chartConfig = {
    scheduled: {
      label: 'Scheduled',
      theme: {
        light: '#d1d5db',
        dark: '#6b7280',
      },
    },
    completed: {
      label: 'Completed',
      theme: {
        light: '#f59e0b',
        dark: '#fbbf24',
      },
    },
    missed: {
      label: 'Missed',
      theme: {
        light: '#ef4444',
        dark: '#fca5a5',
      },
    },
  }

  const colors = {
    scheduled: isDark ? '#6b7280' : '#d1d5db',
    completed: isDark ? '#fbbf24' : '#f59e0b',
    missed: isDark ? '#fca5a5' : '#ef4444',
  }

  return (
    <div>
      <SectionHeader
        title="Weekly Breakdown"
        subtitle="Scheduled · Completed · Missed per week"
      />
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeks}
            barCategoryGap="28%"
            barGap={2}
            margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--primary) / 0.12)', radius: 4 }}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar
              dataKey="scheduled"
              fill={colors.scheduled}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="completed"
              fill={colors.completed}
              radius={[3, 3, 0, 0]}
            />
            <Bar dataKey="missed" fill={colors.missed} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Manual legend */}
      <div className="flex items-center gap-4 mt-3 justify-end">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-xs shrink-0 bg-slate-400 dark:bg-slate-600" />
          Scheduled
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-xs shrink-0 bg-blue-600 dark:bg-blue-400" />
          Completed
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-xs shrink-0 bg-red-600 dark:bg-red-400" />
          Missed
        </span>
      </div>
    </div>
  )
}
