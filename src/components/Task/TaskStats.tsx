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
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
    },
    {
      label: 'Focus Sessions',
      value: focus,
      icon: Flame,
    },
    {
      label: 'Total Tasks',
      value: total,
      icon: ListTodo,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
      ))}
    </div>
  )
}
