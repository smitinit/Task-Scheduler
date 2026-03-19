import React, { useMemo } from 'react'
import { getHours } from 'date-fns'
import { useTheme } from 'next-themes'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionHeader } from './SectionHeader'
import type { HourDataPoint, Task } from './types'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

interface HourDistributionChartProps {
  tasks: Array<Task>
}

export const HourDistributionChart: React.FC<HourDistributionChartProps> = ({
  tasks,
}) => {
  const { theme } = useTheme()

  const hourData = useMemo<Array<HourDataPoint>>(() => {
    const buckets: Record<number, { scheduled: number; completed: number }> = {}
    for (let h = 6; h <= 22; h++) {
      buckets[h] = { scheduled: 0, completed: 0 }
    }
    tasks.forEach((t) => {
      const h = getHours(new Date(t.startTime))
      if (h >= 6 && h <= 22) {
        buckets[h].scheduled++
        if (t.status === 'completed') buckets[h].completed++
      }
    })
    return Object.entries(buckets).map(([h, v]) => ({
      hour: String(h),
      label: `${String(h).padStart(2, '0')}:00`,
      scheduled: v.scheduled,
      completed: v.completed,
    }))
  }, [tasks])

  const peakHour = useMemo(() => {
    return hourData.reduce(
      (best, d) => (d.completed > best.completed ? d : best),
      hourData[0],
    )
  }, [hourData])

  const isDark = theme === 'dark'
  const chartConfig = {
    scheduled: {
      label: 'Scheduled',
      theme: {
        light: '#b4b0ae',
        dark: '#6b6763',
      },
    },
    completed: {
      label: 'Completed',
      theme: {
        light: '#2563eb',
        dark: '#3b82f6',
      },
    },
  }

  const colors = {
    scheduled: isDark ? '#6b6763' : '#b4b0ae',
    completed: isDark ? '#3b82f6' : '#2563eb',
  }

  return (
    <div>
      <SectionHeader
        title="Peak Productivity Hours"
        subtitle="Task activity by hour of day"
      />
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={hourData}
            margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
          >
            <defs>
              {/* Scheduled: muted fill */}
              <linearGradient id="fillScheduled" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={colors.scheduled}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={colors.scheduled}
                  stopOpacity={0}
                />
              </linearGradient>
              {/* Completed: primary fill */}
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={colors.completed}
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor={colors.completed}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              interval={2}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={22}
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--primary) / 0.3)', strokeWidth: 2 }}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            {/* Peak hour reference line */}
            {peakHour.completed > 0 && (
              <ReferenceLine
                x={peakHour.label}
                stroke={colors.completed}
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{
                  value: 'Peak',
                  position: 'top',
                  fontSize: 9,
                  fill: colors.completed,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="scheduled"
              name="Scheduled"
              stroke={colors.scheduled}
              strokeWidth={1.5}
              fill="url(#fillScheduled)"
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                stroke: 'hsl(var(--background))',
                fill: colors.scheduled,
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke={colors.completed}
              strokeWidth={2.5}
              fill="url(#fillCompleted)"
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: 'hsl(var(--background))',
                fill: colors.completed,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex items-center gap-4 mt-3 justify-end">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-4 h-[2px] rounded shrink-0 bg-slate-400 dark:bg-slate-600" />
          Scheduled
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-4 h-[2px] rounded shrink-0 bg-blue-600 dark:bg-blue-400" />
          Completed
        </span>
      </div>
    </div>
  )
}
