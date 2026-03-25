import { useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'

/**
 * Hook to poll and refresh data when page becomes visible
 *
 * Instead of invalidating ALL loaders (which creates waterfalls),
 * pass a custom refresh function that fetches only the data you need.
 *
 * @param onRefresh - Async function called when page becomes visible (replaces router.invalidate())
 * @param intervalMs - How often to poll while page is visible
 *
 * Example:
 * ```ts
 * usePollOnVisible(async () => {
 *   // Fetch only tasks, not all loader data
 *   const tasks = await getTasks()
 *   setTasks(tasks)
 * }, 60_000)
 * ```
 *
 * @deprecated Pass onRefresh callback instead of relying on router.invalidate()
 */
export function usePollOnVisible(
  onRefresh?: () => Promise<void>,
  intervalMs = 60_000,
) {
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    function start() {
      intervalRef.current = setInterval(async () => {
        // Use custom refresh callback if provided, otherwise fall back to router invalidate
        if (onRefresh) {
          try {
            await onRefresh()
          } catch (error) {
            console.error('Error during poll refresh:', error)
          }
        } else {
          // Fallback: invalidate all loaders (less efficient but maintains compatibility)
          router.invalidate()
        }
      }, intervalMs)
    }

    function stop() {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        start()
      } else {
        stop()
      }
    }

    // Initial setup
    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [router, intervalMs, onRefresh])
}
