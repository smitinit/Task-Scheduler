import { useEffect } from 'react'
import { getFCMToken } from '@/lib/firebase-client'
import { useUser } from '@/hooks/useUser'

export function FCMInitializer() {
  const { data: user } = useUser()

  useEffect(() => {
    if (!user) return

    async function register() {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const token = await getFCMToken()
      if (!token) return

      await fetch('/api/register-fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    }

    register()
  }, [user])

  return null
}
