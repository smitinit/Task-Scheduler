import { useQuery } from '@tanstack/react-query'
import { getSessionUser } from '@/lib/sessions'

export function useUser() {
  return useQuery({
    queryKey: ['session-user'],
    queryFn: () => getSessionUser(),
    staleTime: 1000 * 60 * 5, // 5 min
    retry: true, // Retry on network errors for better UX
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
