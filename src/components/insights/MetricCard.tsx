import React from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  accent: string
  trend?: 'up' | 'down'
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  accent,
  trend,
}) => {
  return (
    <div className="glass-widget border-none flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${accent}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-mono font-bold tabular-nums leading-none">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
          {label}
          {trend === 'up' && (
            <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
          )}
          {trend === 'down' && (
            <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
          )}
        </p>
      </div>
    </div>
  )
}
