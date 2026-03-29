import { useQuery } from '@tanstack/react-query'
import { getSessionUser } from '@/lib/session-user'

export function useUser() {
  return useQuery({
    queryKey: ['session-user'],
    queryFn: () => getSessionUser(),
    // Keep session data fresh so post-login/signup state is reflected immediately.
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: true, // Retry on network errors for better UX
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
