import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useHotkey } from '@tanstack/react-hotkeys'
import {
  Home,
  Plus,
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Calendar,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { ThemeToggle } from '@/components/ThemeToggle'
import LogoutButton from '@/components/LogoutButton'

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

interface RightSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function RightSidebar({ open, setOpen }: RightSidebarProps) {
  const { data: user } = useUser()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (to: string) => location.pathname === to

  // Register hotkeys
  useHotkey('Mod+B', () => setOpen(!open), { preventDefault: true })

  useHotkey(
    'Mod+0',
    () => {
      navigate({ to: '/' })
    },
    { preventDefault: true },
  )

  // Register navigation hotkeys
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
    <>
      {user && (
        <>
          {/* Open Button - Shows when taskbar is hidden */}
          {!open && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 35, stiffness: 400 }}
              onClick={() => setOpen(true)}
              className="fixed bottom-6 left-6 z-40 p-3 rounded-lg glass hover:bg-background/80 dark:hover:bg-background/60 transition-all shadow-lg"
              aria-label="Open taskbar (Mod+B)"
              title="Open taskbar (Mod+B)"
            >
              <ChevronUp size={24} className="text-foreground" />
            </motion.button>
          )}

          {/* Bottom Taskbar */}
          <motion.aside
            initial={{ y: open ? 0 : 100 }}
            animate={open ? { y: 0 } : { y: 100 }}
            transition={{ type: 'spring', damping: 35, stiffness: 400 }}
            className="bottom-taskbar fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4"
            aria-label="Bottom taskbar navigation"
            role="complementary"
          >
            {/* Toggle Button */}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg transition-all"
              aria-label={
                open ? 'Hide taskbar (Mod+B)' : 'Show taskbar (Mod+B)'
              }
              title={open ? 'Hide taskbar (Mod+B)' : 'Show taskbar (Mod+B)'}
            >
              {open ? (
                <ChevronDown size={20} className="text-foreground" />
              ) : (
                <ChevronUp size={20} className="text-foreground" />
              )}
            </button>

            {/* Nav items - centered */}
            <nav
              className="flex items-center gap-2 flex-1 justify-center"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = isActive(item.to)

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`taskbar-nav-item flex items-center justify-center p-2 rounded-lg transition-all duration-200 relative group ${
                      active
                        ? 'active'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title={`${item.label} (${item.hotkeyDisplay})`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon
                      size={20}
                      className="flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right side - Theme Toggle and Logout */}
            <div
              className="flex items-center gap-1 flex-shrink-0"
              role="region"
              aria-label="Settings"
            >
              <ThemeToggle />
              <LogoutButton />
            </div>
          </motion.aside>
        </>
      )}
    </>
  )
}
