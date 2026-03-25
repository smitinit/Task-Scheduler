import React from 'react'
import { AlertTriangle, CheckCircle2, Zap } from 'lucide-react'
import type { InsightEntry } from './types'

interface InsightCalloutProps extends InsightEntry {}

export const InsightCallout: React.FC<InsightCalloutProps> = ({
  type,
  message,
}) => {
  const styles: Record<InsightEntry['type'], string> = {
    warning:
      'bg-amber-500/10 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400',
    success:
      'bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400',
    info: 'bg-primary/10 dark:bg-primary/5 text-primary',
  }
  const icons: Record<InsightEntry['type'], React.ElementType> = {
    warning: AlertTriangle,
    success: CheckCircle2,
    info: Zap,
  }
  const Icon = icons[type]

  return (
    <div
      className={`glass border-none rounded-xl px-3 py-2.5 flex items-start gap-2.5 text-[13px] ${styles[type]}`}
    >
      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <span className="leading-snug">{message}</span>
    </div>
  )
}
