import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur supports-backdrop-filter:bg-background/20">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-semibold mb-4">Task Scheduler</h3>
              <p className="text-sm text-muted-foreground">
                Schedule tasks efficiently and never miss a deadline.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tasks"
                    className="hover:text-foreground transition-colors"
                  >
                    Tasks
                  </Link>
                </li>
                <li>
                  <Link
                    to="/calendar"
                    className="hover:text-foreground transition-colors"
                  >
                    Calendar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    className="hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    className="hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2026 Task Scheduler. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
