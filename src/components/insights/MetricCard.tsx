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
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        {trend === 'up' && (
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
        )}
        {trend === 'down' && (
          <TrendingDown className="w-3.5 h-3.5 text-red-500" />
        )}
      </div>
      <div>
        <p className="text-[22px] font-mono font-bold tabular-nums leading-none tracking-tight">
          {value}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  )
}
