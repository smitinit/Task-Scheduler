/**
 * Hook to convert CSS theme variables to actual colors for Recharts
 * Recharts doesn't support CSS variables directly in SVG, so we need to
 * extract the computed values at runtime
 */
export function useChartColors() {
  function getChartColor(variable: string): string {
    if (typeof window === 'undefined') return '#888'
    try {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim()
      return `hsl(${value})`
    } catch {
      return '#888'
    }
  }

  return {
    completed: getChartColor('--color-chart-1'),
    scheduled: getChartColor('--color-chart-3'),
    missed: getChartColor('--color-destructive'),
    focus: getChartColor('--color-chart-2'),
    neutral: getChartColor('--color-chart-4'),
    lightNeutral: getChartColor('--color-chart-5'),
    grid: getChartColor('--color-border'),
    text: getChartColor('--color-muted-foreground'),
    card: getChartColor('--color-card'),
    primary: getChartColor('--color-primary'),
  }
}
