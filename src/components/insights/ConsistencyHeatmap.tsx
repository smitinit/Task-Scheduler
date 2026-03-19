import React, { useMemo } from 'react'
import { eachDayOfInterval, format, getDay, subDays } from 'date-fns'
import { SectionHeader } from './SectionHeader'
import type { Task } from './types'

interface ConsistencyHeatmapProps {
  tasks: Array<Task>
}

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({
  tasks,
}) => {
  const today = new Date()
  const rangeStart = subDays(today, 6 * 7 - 1)

  const completedByDay = useMemo(() => {
    const map: Record<string, number> = {}
    tasks
      .filter((t) => t.status === 'completed')
      .forEach((t) => {
        const key = format(new Date(t.startTime), 'yyyy-MM-dd')
        map[key] = (map[key] ?? 0) + 1
      })
    return map
  }, [tasks])

  const days = eachDayOfInterval({ start: rangeStart, end: today })

  const weeks = useMemo<Array<Array<Date>>>(() => {
    const result: Array<Array<Date>> = []
    let week: Array<Date> = []
    days.forEach((d, i) => {
      week.push(d)
      if (getDay(d) === 6 || i === days.length - 1) {
        result.push(week)
        week = []
      }
    })
    return result
  }, [days])

  const maxCount = Math.max(...Object.values(completedByDay), 1)

  // 5 intensity steps using the primary color at increasing opacity
  function cellStyle(count: number, isToday: boolean): React.CSSProperties {
    const intensity = count === 0 ? 0 : count / maxCount
    const opacity =
      count === 0
        ? 0.07
        : intensity < 0.25
          ? 0.25
          : intensity < 0.5
            ? 0.45
            : intensity < 0.75
              ? 0.7
              : 1

    return {
      background: `hsl(var(--primary) / ${opacity})`,
      outline: isToday ? '1.5px solid hsl(var(--primary))' : 'none',
      outlineOffset: '1px',
    }
  }

  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const todayKey = format(today, 'yyyy-MM-dd')

  // Month labels: find first day of each month in range
  const monthLabels = useMemo(() => {
    const labels: Array<{ label: string; weekIndex: number }> = []
    weeks.forEach((week, wi) => {
      week.forEach((day) => {
        if (day.getDate() === 1 || (wi === 0 && day === week[0])) {
          if (!labels.find((l) => l.weekIndex === wi)) {
            labels.push({ weekIndex: wi, label: format(day, 'MMM') })
          }
        }
      })
    })
    return labels
  }, [weeks])

  return (
    <div>
      <SectionHeader
        title="Completion Consistency"
        subtitle="Completed tasks per day — last 6 weeks"
      />
      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] pt-5">
          {DAY_LABELS.map((d, i) => (
            <span
              key={i}
              className="text-[9px] text-muted-foreground/40 w-3 h-[13px] flex items-center justify-end pr-0.5"
            >
              {i % 2 === 1 ? d : ''}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1 h-4">
            {weeks.map((_, wi) => {
              const ml = monthLabels.find((m) => m.weekIndex === wi)
              return (
                <div key={wi} className="w-[13px] shrink-0">
                  {ml && (
                    <span className="text-[9px] text-muted-foreground/50 whitespace-nowrap">
                      {ml.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Cells */}
          <div className="flex gap-[3px] overflow-x-auto pb-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => {
                  const key = format(day, 'yyyy-MM-dd')
                  const count = completedByDay[key] ?? 0
                  const isToday = key === todayKey
                  return (
                    <div
                      key={key}
                      title={`${format(day, 'MMM d, EEE')} · ${count} completed`}
                      className="w-[13px] h-[13px] rounded-[3px] cursor-default transition-all hover:scale-110 hover:shadow-md hover:z-10"
                      style={cellStyle(count, isToday)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[10px] text-muted-foreground/50">Less</span>
        {[0.07, 0.25, 0.45, 0.7, 1].map((op) => (
          <div
            key={op}
            className="w-[13px] h-[13px] rounded-[3px]"
            style={{ background: `hsl(var(--primary) / ${op})` }}
          />
        ))}
        <span className="text-[10px] text-muted-foreground/50">More</span>
      </div>
    </div>
  )
}
