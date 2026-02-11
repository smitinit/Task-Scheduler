import { useNavigate } from '@tanstack/react-router'
import { Loader, LogOutIcon } from 'lucide-react'
import { useTransition } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { logout } from '@/action/auth'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const handleLogout = () => {
    startTransition(async () => {
      await logout()
      queryClient.setQueryData(['session-user'], null)
      navigate({ to: '/login' })
    })
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isPending}>
      {isPending ? (
        <Loader className="animate-spin" />
      ) : (
        <LogOutIcon className="h-4 w-4" />
      )}
      Logout
    </Button>
  )
}
