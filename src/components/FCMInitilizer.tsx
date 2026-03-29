import { useCallback, useEffect, useRef, useState } from 'react'
import { Bell, BellOff, BellRing, Loader2 } from 'lucide-react'
import {
  clearCachedFCMToken,
  getFCMToken,
  getStoredFCMToken,
  popPendingFCMToken,
} from '@/lib/firebase-client'
import { useUser } from '@/hooks/useUser'
import { registerFCMToken } from '@/action/register-fcm-token'

export function FCMInitializer() {
  const { data: user } = useUser()
  const isNotificationSupported =
    typeof window !== 'undefined' && 'Notification' in window
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  )
  const [isRegistering, setIsRegistering] = useState(false)
  const inFlightRef = useRef(false)
  const attemptedUserRef = useRef<string | null>(null)
  const [lastRegistrationOk, setLastRegistrationOk] = useState(false)

  const registerToken = useCallback(async () => {
    if (inFlightRef.current) {
      console.info(
        '[FCM] Registration already in progress; skipping duplicate call',
      )
      return
    }

    console.info('[FCM] Starting token registration flow')
    inFlightRef.current = true
    setIsRegistering(true)
    try {
      const pendingToken = popPendingFCMToken()
      if (pendingToken) {
        console.info('[FCM] Found pre-auth cached token; persisting now')
        await registerFCMToken({ data: { token: pendingToken } })
        console.info('[FCM] Cached token persisted successfully')
        setLastRegistrationOk(true)
        return
      }

      const token = await getFCMToken()
      if (!token) {
        console.warn(
          '[FCM] Token was not generated. Check permission, browser support, service worker, and VAPID key.',
        )
        return
      }

      console.info('[FCM] Sending token to server for persistence')
      await registerFCMToken({ data: { token } })
      console.info('[FCM] Token persisted successfully')
      setLastRegistrationOk(true)
    } catch (error) {
      setLastRegistrationOk(false)
      clearCachedFCMToken()
      console.error('[FCM] Failed to persist FCM token:', error)
    } finally {
      inFlightRef.current = false
      setIsRegistering(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    if (!isNotificationSupported) return

    console.info(
      '[FCM] User session detected; evaluating notification permission',
    )
    setPermission(Notification.permission)
  }, [user, isNotificationSupported])

  useEffect(() => {
    if (!user) return
    if (permission !== 'granted') return

    if (attemptedUserRef.current === user.id) {
      console.info(
        '[FCM] Auto-registration already attempted for this user session',
      )
      return
    }

    attemptedUserRef.current = user.id
    console.info('[FCM] Permission granted; syncing token in background')
    registerToken()
  }, [permission, user, registerToken])

  const isDenied = permission === 'denied'
  const isEnabled = permission === 'granted' && lastRegistrationOk

  async function unregisterCurrentToken() {
    const token = getStoredFCMToken()

    try {
      console.info('[FCM] Unregistering token from bell toggle')
      await fetch('/api/unregister-fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(token ? { token } : {}),
      })
      clearCachedFCMToken()
      setLastRegistrationOk(false)
      console.info('[FCM] Notifications disabled by user')
    } catch (error) {
      console.error('[FCM] Failed to unregister token:', error)
    }
  }

  async function handleBellToggle() {
    if (isRegistering) return

    if (isEnabled) {
      await unregisterCurrentToken()
      return
    }

    if (Notification.permission === 'default') {
      console.info('[FCM] Requesting notification permission from user gesture')
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        await registerToken()
      } else if (result === 'denied') {
        console.warn(
          '[FCM] Permission denied. Enable notifications from browser site settings.',
        )
      } else {
        console.info('[FCM] Permission prompt dismissed by user')
      }

      return
    }

    if (Notification.permission === 'granted') {
      setPermission('granted')
      await registerToken()
      return
    }

    setPermission('denied')
    console.warn(
      '[FCM] Notifications are blocked. Enable permission in browser site settings.',
    )
  }

  if (!user) return null
  if (!isNotificationSupported) return null

  return (
    <button
      type="button"
      onClick={handleBellToggle}
      disabled={isRegistering}
      className="p-2 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-background/50 disabled:opacity-50 disabled:cursor-not-allowed"
      title={
        isDenied
          ? 'Notifications blocked. Enable from browser site settings.'
          : isEnabled
            ? 'Disable notifications'
            : 'Enable notifications'
      }
      aria-label={
        isDenied
          ? 'Notifications blocked. Enable from browser settings'
          : isEnabled
            ? 'Disable notifications'
            : 'Enable notifications'
      }
    >
      {isRegistering ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isDenied ? (
        <BellOff className="h-5 w-5" />
      ) : isEnabled ? (
        <BellRing className="h-5 w-5" />
      ) : (
        <Bell className="h-5 w-5" />
      )}
    </button>
  )
}
