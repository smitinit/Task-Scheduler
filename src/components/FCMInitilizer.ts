import { useEffect } from 'react'
import { useRegisterFCM } from '@/hooks/useRegisterFcm'

export function FCMInitializer() {
  useRegisterFCM()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(() => {
          console.log('Service Worker registered')
        })
        .catch((err) => {
          console.error('SW registration failed:', err)
        })
    }
  }, [])

  return null
}
