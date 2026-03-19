import React from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-4">
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>
      )}
    </div>
  )
}
