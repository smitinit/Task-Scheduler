import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'
import {
  BarChart3,
  Calendar,
  CheckSquare,
  Home,
  LayoutDashboard,
  LogIn,
  Plus,
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { ThemeToggle } from '@/components/ThemeToggle'
import LogoutButton from '@/components/LogoutButton'
import { FCMInitializer } from '@/components/FCMInitilizer'

const NAV_ITEMS = [
  {
    label: 'Home',
    to: '/',
    icon: Home,
    hotkey: 'Mod+0',
    hotkeyDisplay: 'Ctrl+0',
  },
  {
    label: 'Add',
    to: '/add',
    icon: Plus,
    hotkey: 'Mod+1',
    hotkeyDisplay: 'Ctrl+1',
  },
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    hotkey: 'Mod+2',
    hotkeyDisplay: 'Ctrl+2',
  },
  {
    label: 'Tasks',
    to: '/tasks',
    icon: CheckSquare,
    hotkey: 'Mod+3',
    hotkeyDisplay: 'Ctrl+3',
  },
  {
    label: 'Insights',
    to: '/insights',
    icon: BarChart3,
    hotkey: 'Mod+4',
    hotkeyDisplay: 'Ctrl+4',
  },
  {
    label: 'Calendar',
    to: '/calendar',
    icon: Calendar,
    hotkey: 'Mod+5',
    hotkeyDisplay: 'Ctrl+5',
  },
]

export default function RightSidebar() {
  const { data: user } = useUser()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (to: string) => location.pathname === to

  // Register navigation hotkeys
  useHotkey(
    'Mod+0',
    () => {
      navigate({ to: '/' })
    },
    { preventDefault: true },
  )
  useHotkey(
    'Mod+1',
    () => {
      navigate({ to: '/add' })
    },
    { preventDefault: true },
  )

  useHotkey(
    'Mod+2',
    () => {
      navigate({ to: '/dashboard' })
    },
    { preventDefault: true },
  )

  useHotkey(
    'Mod+3',
    () => {
      navigate({ to: '/tasks' })
    },
    { preventDefault: true },
  )

  useHotkey(
    'Mod+4',
    () => {
      navigate({ to: '/insights' })
    },
    { preventDefault: true },
  )

  useHotkey(
    'Mod+5',
    () => {
      navigate({ to: '/calendar' })
    },
    { preventDefault: true },
  )

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 w-20 flex flex-col items-center justify-between py-4 border-r border-border bg-linear-to-b from-background/80 to-background/60 backdrop-blur-md"
      style={{ top: 'var(--app-top-offset, 0px)' }}
      aria-label="Left sidebar navigation"
      role="complementary"
    >
      {/* Nav items - vertical */}
      <nav
        className="flex flex-col items-center gap-2 flex-1 justify-center"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 relative group ${
                active
                  ? ' text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
              title={`${item.label} (${item.hotkeyDisplay})`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} className="shrink-0" aria-hidden="true" />
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 bg-primary rounded-full" />
              )}
              <span className="sr-only">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom - Theme Toggle and Auth Controls */}
      <div
        className="flex flex-col items-center gap-1 shrink-0"
        role="region"
        aria-label="Settings"
      >
        <FCMInitializer />
        <ThemeToggle />
        {user ? (
          <LogoutButton />
        ) : (
          <Link
            to="/login"
            className="p-2 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-background/50"
            title="Login"
            aria-label="Login"
          >
            <LogIn size={20} className="shrink-0" aria-hidden="true" />
          </Link>
        )}
      </div>
    </aside>
  )
}
