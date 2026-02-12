import { useEffect } from 'react'
import { getFCMToken } from '@/lib/firebase-client'

export function useRegisterFCM() {
  useEffect(() => {
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
  }, [])
}
