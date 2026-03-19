import { useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'

/**
 * Hook to poll and invalidate data when page becomes visible
 * Useful for keeping data fresh when user returns to the tab
 */
export function usePollOnVisible(intervalMs = 60_000) {
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    function start() {
      intervalRef.current = setInterval(() => {
        router.invalidate()
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
  }, [router, intervalMs])
}
