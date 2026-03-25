export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  accent: string
}) {
  return (
    <div className="glass-widget border-none flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-md flex items-center justify-center ${accent}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-2xl font-mono font-bold tabular-nums leading-none">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  )
}
