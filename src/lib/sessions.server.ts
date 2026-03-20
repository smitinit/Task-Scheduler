import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth-server'

export async function getCurrentSession() {
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
}
