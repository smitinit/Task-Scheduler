import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getCurrentSession } from '@/lib/sessions'

export const checkAuthServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { user } = await getCurrentSession()

  if (!user) {
    throw redirect({ to: '/login' })
  }

  return { user }
})
