import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'

import { useEffect, useState } from 'react'
import { HotkeysProvider } from '@tanstack/react-hotkeys'
import RightSidebar from '../components/RightSidebar'
import Footer from '../components/Footer'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@/integrations/next-themes/theme-provider'
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary'
import { GlobalNotFound } from '@/components/GlobalNotFound'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Task Scheduler',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  errorComponent: GlobalErrorBoundary,
  notFoundComponent: GlobalNotFound,
})

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const shouldShowFooter = location.pathname === '/'
  const [taskbarOpen, setTaskbarOpen] = useState(true)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HotkeysProvider
            defaultOptions={{
              hotkey: { preventDefault: true, ignoreInputs: true },
            }}
          >
            <ScrollToTop />
            <div className="flex flex-col h-screen">
              {/* Main content */}
              <main className="flex-1 overflow-auto pb-[100px]">
                <div className="mx-auto max-w-6xl p-4 min-h-screen">
                  {children}
                </div>
                {shouldShowFooter && <Footer />}
              </main>

              {/* Bottom taskbar */}
              <RightSidebar open={taskbarOpen} setOpen={setTaskbarOpen} />
            </div>
          </HotkeysProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
