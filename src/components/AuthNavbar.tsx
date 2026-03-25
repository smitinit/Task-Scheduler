import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function AuthNavbar() {
  return (
    <header className="glass-navbar w-full">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / Title */}
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Task Scheduler
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
