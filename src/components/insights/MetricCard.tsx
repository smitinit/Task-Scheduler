import React from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  trend?: 'up' | 'down'
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
}) => {
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
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            {trend === 'up' && (
              <TrendingUp className="w-3 h-3 text-chart-1 flex-shrink-0" />
            )}
            {trend === 'down' && (
              <TrendingDown className="w-3 h-3 text-destructive flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
