import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_WEB_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export async function getFCMToken() {
  if (typeof window === 'undefined') return null

  const supported = await isSupported()
  if (!supported) return null

  if (!('serviceWorker' in navigator)) return null

  // 🔒 Explicit SW registration
  const registration = await navigator.serviceWorker.register(
    '/firebase-messaging-sw.js',
  )

  const messaging = getMessaging(app)

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  })

  return token
}
