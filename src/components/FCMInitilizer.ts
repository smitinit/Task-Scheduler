import { useEffect } from 'react'
import { getFCMToken } from '@/lib/firebase-client'
import { useUser } from '@/hooks/useUser'
import { registerFCMToken } from '@/action/register-fcm-token'

export function FCMInitializer() {
  const { data: user } = useUser()

  useEffect(() => {
    if (!user) return

    async function register() {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const token = await getFCMToken()
      if (!token) return

      // Use server function instead of fetch() for type safety and consistency
      await registerFCMToken({ data: { token } })
    }

    register()
  }, [user])

  return null
}
