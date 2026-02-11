import { createServerFn } from '@tanstack/react-start'
import { getCurrentSession } from '@/lib/sessions'

export const getSessionUser = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { user } = await getCurrentSession()
  return user
})
