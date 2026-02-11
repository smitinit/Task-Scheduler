import { useQuery } from '@tanstack/react-query'
import { getSessionUser } from '@/action/get-user'

export function useUser() {
  return useQuery({
    queryKey: ['session-user'],
    queryFn: () => getSessionUser(),
    staleTime: 1000 * 60 * 5, // 5 min
    retry: false,
  })
}
