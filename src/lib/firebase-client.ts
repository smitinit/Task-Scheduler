import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

import type { FirebaseApp } from 'firebase/app'
import type { Messaging } from 'firebase/messaging'

import { getClientEnv } from '@/lib/env-config'

// Defer Firebase initialization until first use
// This avoids loading the Firebase SDK for users who don't enable notifications
let app: FirebaseApp | null = null
let messaging: Messaging | null = null

/**
 * Initialize Firebase on-demand (lazy loading)
 * Only called when FCM token is actually needed
 */
function initializeFirebase(): FirebaseApp {
  if (app) return app

  const env = getClientEnv()

  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_WEB_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  }

  app = initializeApp(firebaseConfig)
  return app
}

/**
 * Get Firebase messaging instance (lazy initialized)
 */
function getMessagingInstance(): Messaging {
  if (messaging) return messaging

  const firebaseApp = initializeFirebase()
  messaging = getMessaging(firebaseApp)
  return messaging
}

/**
 * Get FCM token for push notifications
 * Deferred: Firebase only loads when this function is called
 */
export async function getFCMToken() {
  if (typeof window === 'undefined') return null

  const supported = await isSupported()
  if (!supported) return null

  if (!('serviceWorker' in navigator)) return null

  // Check if notification permission is granted
  if (Notification.permission !== 'granted') return null

  try {
    // Explicit SW registration
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
    )

    const env = getClientEnv()
    const fcmMessaging = getMessagingInstance()

    const token = await getToken(fcmMessaging, {
      vapidKey: env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    })

    return token
  } catch (error) {
    console.error('FCM token error:', error)
    return null
  }
}
