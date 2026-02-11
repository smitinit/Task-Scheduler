import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useUser } from '@/hooks/useUser'

const NAV_ITEMS = [
  { label: 'Tasks', to: '/tasks' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Insights', to: '/insights' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { data: user, isLoading } = useUser()
  const location = useLocation()

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

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
            {user &&
              NAV_ITEMS.map((item) => {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeProps={{
                      className: 'text-foreground font-medium',
                    }}
                    inactiveProps={{
                      className: 'text-muted-foreground',
                    }}
                    className="text-sm transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )
              })}

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isLoading ? null : user && <LogoutButton />}
            </div>
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
            {user &&
              NAV_ITEMS.map((item) => {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeProps={{
                      className: 'text-foreground font-medium',
                    }}
                    inactiveProps={{
                      className: 'text-muted-foreground',
                    }}
                    className="text-sm transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )
              })}
            {user && <LogoutButton />}
          </div>
        </div>
      )}
    </header>
  )
}
