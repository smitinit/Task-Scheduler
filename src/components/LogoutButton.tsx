import { useNavigate } from '@tanstack/react-router'
import { Loader, LogOutIcon } from 'lucide-react'
import { useTransition } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { signOut } from '@/lib/auth/client'
import { getFCMToken } from '@/lib/firebase-client'

export default function LogoutButton() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      try {
        // Unregister FCM token if available
        const token = await getFCMToken()
        if (token) {
          try {
            await fetch('/api/unregister-fcm-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            })
          } catch (error) {
            // Fail silently - don't block logout on FCM error
            console.error('FCM unregistration error:', error)
          }
        }
      } catch (error) {
        // Fail silently for FCM errors
        console.error('FCM error:', error)
      }

      try {
        // Sign out from server
        await signOut()

        // Clear session from cache
        queryClient.setQueryData(['session-user'], null)

        // Redirect to login
        navigate({ to: '/login' })
      } catch (error) {
        console.error('Logout error:', error)
        // Even if logout fails, redirect to login
        navigate({ to: '/login' })
      }
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="p-2 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5 disabled:opacity-50"
      title="Logout"
      aria-label="Logout"
    >
      {isPending ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <LogOutIcon className="h-5 w-5" />
      )}
    </button>
  )
}
