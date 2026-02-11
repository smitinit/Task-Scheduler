import { Card, CardContent } from '@/components/ui/card'

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
    { label: 'Total', value: total },
    { label: 'Today', value: today },
    { label: 'Completed', value: completed },
    { label: 'Focus', value: focus },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card
          className="border border-border/40 bg-background shadow-sm hover:shadow-md transition"
          key={s.label}
        >
          <CardContent className="text-center">
            <p className="text-3xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
