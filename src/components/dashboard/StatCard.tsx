import { Card } from '@/components/ui/card'

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number | string
  icon: React.ElementType
}) {
  return (
    <Card className="h-24 flex items-center px-5 hover:bg-muted/40 transition-colors duration-200">
      <div className="flex items-center gap-3 w-full">
        <div className="p-2.5 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="flex flex-col justify-center flex-1 min-w-0">
          <div className="text-2xl font-semibold leading-none tabular-nums">
            {value}
          </div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  )
}
