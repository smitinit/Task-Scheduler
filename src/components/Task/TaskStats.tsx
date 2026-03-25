import { CheckCircle2, Clock, Flame, ListTodo } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'

export default function TaskStats({
  total,
  today,
  completed,
  focus,
}: {
  total: number
  today: number
  completed: number
  focus: number
}) {
  const stats = [
    {
      label: "Today's Tasks",
      value: today,
      icon: Clock,
      accent: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      accent: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      label: 'Focus Sessions',
      value: focus,
      icon: Flame,
      accent: 'bg-orange-500/10 text-orange-500',
    },
    {
      label: 'Total Tasks',
      value: total,
      icon: ListTodo,
      accent: 'bg-purple-500/10 text-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <StatCard
          key={s.label}
          label={s.label}
          value={s.value}
          icon={s.icon}
          accent={s.accent}
        />
      ))}
    </div>
  )
}
