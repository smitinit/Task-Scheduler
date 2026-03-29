import React, { useMemo } from 'react'
import { getHours } from 'date-fns'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionHeader } from './SectionHeader'
import type { HourDataPoint, Task } from './types'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { useChartColors } from '@/hooks/useChartColors'

interface HourDistributionChartProps {
  tasks: Array<Task>
}

export const HourDistributionChart: React.FC<HourDistributionChartProps> = ({
  tasks,
}) => {
  const colors = useChartColors()

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

  const chartConfig = {
    scheduled: {
      label: 'Scheduled',
      color: colors.scheduled,
    },
    completed: {
      label: 'Completed',
      color: colors.completed,
    },
  }

  return (
    <div>
      <SectionHeader
        title="Peak Productivity Hours"
        subtitle="Task activity by hour of day"
      />
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={hourData}
            margin={{ top: 16, right: 8, left: -12, bottom: 8 }}
          >
            <defs>
              <linearGradient
                id="completedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={colors.completed}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={colors.completed}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient
                id="scheduledGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={colors.scheduled}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={colors.scheduled}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={colors.grid}
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.4}
            />
            <XAxis
              dataKey="label"
              tick={{
                fontSize: 12,
                fill: colors.text,
              }}
              interval={2}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: colors.text,
              }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={28}
            />
            <Tooltip
              cursor={{ stroke: colors.completed + '40', strokeWidth: 2 }}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '16px',
              }}
              iconType="line"
            />
            {peakHour.completed > 0 && (
              <ReferenceLine
                x={peakHour.label}
                stroke={colors.completed}
                strokeDasharray="4 3"
                strokeWidth={1.5}
                opacity={0.6}
                label={{
                  value: 'Peak',
                  position: 'top',
                  fontSize: 11,
                  fill: colors.text,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="scheduled"
              name="Scheduled"
              stroke={colors.scheduled}
              fill="url(#scheduledGradient)"
              strokeWidth={2}
              dot={false}
              animationDuration={600}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: colors.scheduled,
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke={colors.completed}
              fill="url(#completedGradient)"
              strokeWidth={2.5}
              dot={false}
              animationDuration={600}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: colors.completed,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
