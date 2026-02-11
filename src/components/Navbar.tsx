import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getSessionUser } from '@/action/get-user'

const NAV_ITEMS = [
  { label: 'Tasks', to: '/tasks' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Insights', to: '/insights' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<null | { id: string }>(null)

  const location = useLocation()

  useEffect(() => {
    async function loadUser() {
      const result = await getSessionUser()
      setUser(result)
    }

    loadUser()
  }, [])

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / Title */}
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Task Scheduler
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.to)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'text-sm transition-colors hover:text-foreground',
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            <ThemeToggle />
            {user && <LogoutButton />}
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />

            <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="flex flex-col px-4 py-3 space-y-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.to)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'text-sm transition-colors',
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
