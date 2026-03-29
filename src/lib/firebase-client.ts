import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

import type { FirebaseApp } from 'firebase/app'
import type { Messaging } from 'firebase/messaging'

import { getClientEnv } from '@/lib/env-config'

const PENDING_FCM_TOKEN_KEY = 'pending-fcm-token'
const ACTIVE_FCM_TOKEN_KEY = 'active-fcm-token'

// Defer Firebase initialization until first use
// This avoids loading the Firebase SDK for users who don't enable notifications
let app: FirebaseApp | null = null
let messaging: Messaging | null = null
let swRegistrationPromise: Promise<ServiceWorkerRegistration> | null = null

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

function getCachedFCMToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACTIVE_FCM_TOKEN_KEY)
}

export function getStoredFCMToken(): string | null {
  return getCachedFCMToken()
}

function saveActiveFCMToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACTIVE_FCM_TOKEN_KEY, token)
}

async function getMessagingServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!swRegistrationPromise) {
    console.info('[FCM] Registering firebase messaging service worker')
    swRegistrationPromise = navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(async () => navigator.serviceWorker.ready)
      .catch((error) => {
        // Reset cached promise so future attempts can retry.
        swRegistrationPromise = null
        throw error
      })
  }

  const registration = await swRegistrationPromise

  if (!('pushManager' in registration)) {
    console.warn('[FCM] Push manager is not available on service worker')
    return null
  }

  return registration
}

/**
 * Get FCM token for push notifications
 * Deferred: Firebase only loads when this function is called
 */
export async function getFCMToken() {
  if (typeof window === 'undefined') {
    console.info('[FCM] Token generation skipped on server runtime')
    return null
  }

  const supported = await isSupported()
  if (!supported) {
    console.warn('[FCM] Firebase messaging is not supported in this browser')
    return null
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[FCM] Service worker is not supported in this browser')
    return null
  }

  // Check if notification permission is granted
  if (Notification.permission !== 'granted') {
    console.info(
      `[FCM] Notification permission is ${Notification.permission}; token generation paused`,
    )
    return null
  }

  try {
    const cachedToken = getCachedFCMToken()
    if (cachedToken) {
      console.info('[FCM] Reusing cached token')
      return cachedToken
    }

    const registration = await getMessagingServiceWorker()
    if (!registration) {
      console.warn('[FCM] Service worker registration is unavailable for FCM')
      return null
    }

    const env = getClientEnv()
    const fcmMessaging = getMessagingInstance()

    const token = await getToken(fcmMessaging, {
      vapidKey: env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    })

    if (!token) {
      console.warn('[FCM] getToken returned empty token')
      return null
    }

    saveActiveFCMToken(token)
    console.info('[FCM] Token generated successfully')

    return token
  } catch (error) {
    console.error('[FCM] Token generation failed:', error)
    return null
  }
}

export function popPendingFCMToken(): string | null {
  if (typeof window === 'undefined') return null

  const token = window.localStorage.getItem(PENDING_FCM_TOKEN_KEY)
  if (!token) return null

  window.localStorage.removeItem(PENDING_FCM_TOKEN_KEY)
  return token
}

export function clearCachedFCMToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACTIVE_FCM_TOKEN_KEY)
}

function savePendingFCMToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PENDING_FCM_TOKEN_KEY, token)
}

export async function warmupFCMTokenOnAuthGesture() {
  if (typeof window === 'undefined') return
  if (!('Notification' in window)) return

  try {
    if (Notification.permission === 'default') {
      console.info(
        '[FCM] Login/signup gesture detected; requesting permission early',
      )
      await Notification.requestPermission()
    }

    if (Notification.permission !== 'granted') {
      console.info(
        `[FCM] Permission is ${Notification.permission}; token warmup skipped before auth redirect`,
      )
      return
    }

    const token = await getFCMToken()
    if (!token) return

    savePendingFCMToken(token)
    console.info('[FCM] Token warmed up and cached for post-login persistence')
  } catch (error) {
    console.error('[FCM] Failed during pre-auth token warmup:', error)
  }
}
