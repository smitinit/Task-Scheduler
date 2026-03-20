import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth-server'

export const getSessionServerFn = createServerFn().handler(async () => {
  try {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({
      headers: headers,
    })
    return {
      user: session?.user || null,
      session: session?.session || null,
    }
  } catch (error) {
    return { user: null, session: null }
  }
})
