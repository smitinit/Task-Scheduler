import '@tanstack/react-start/server-only'

import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth-server'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({
      headers: {
        ...Object.fromEntries(headers.entries()),
        origin: headers.get('origin'),
      },
    })

    return session
  },
)

export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({
      headers: {
        ...Object.fromEntries(headers.entries()),
        origin: headers.get('origin'),
      },
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return session
  },
)
