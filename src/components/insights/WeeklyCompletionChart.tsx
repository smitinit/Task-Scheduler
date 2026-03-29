import React, { useMemo } from 'react'
import { endOfWeek, startOfWeek, subWeeks } from 'date-fns'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionHeader } from './SectionHeader'
import type { Task, WeekDataPoint } from './types'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { useChartColors } from '@/hooks/useChartColors'

interface WeeklyCompletionChartProps {
  tasks: Array<Task>
}

export const WeeklyCompletionChart: React.FC<WeeklyCompletionChartProps> = ({
  tasks,
}) => {
  const colors = useChartColors()

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

  const chartConfig = {
    scheduled: {
      label: 'Scheduled',
      color: colors.scheduled,
    },
    completed: {
      label: 'Completed',
      color: colors.completed,
    },
    missed: {
      label: 'Missed',
      color: colors.missed,
    },
  }

  return (
    <div>
      <SectionHeader
        title="Weekly Breakdown"
        subtitle="Scheduled · Completed · Missed per week"
      />
      <ChartContainer config={chartConfig} className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeks}
            barCategoryGap="20%"
            barGap={4}
            margin={{ top: 16, right: 8, left: -12, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--color-border))"
              opacity={0.4}
            />
            <XAxis
              dataKey="label"
              tick={{
                fontSize: 12,
                fill: 'hsl(var(--color-muted-foreground))',
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: 'hsl(var(--color-muted-foreground))',
              }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--color-muted) / 0.5)', radius: 6 }}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Legend wrapperStyle={{ paddingTop: '16px' }} iconType="circle" />
            <Bar
              dataKey="scheduled"
              fill="hsl(var(--color-chart-3))"
              radius={[6, 6, 0, 0]}
              barSize={22}
              animationDuration={600}
              isAnimationActive={true}
            />
            <Bar
              dataKey="completed"
              fill="hsl(var(--color-chart-1))"
              radius={[6, 6, 0, 0]}
              barSize={22}
              animationDuration={600}
              isAnimationActive={true}
            />
            <Bar
              dataKey="missed"
              fill="hsl(var(--color-destructive))"
              radius={[6, 6, 0, 0]}
              barSize={22}
              animationDuration={600}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
