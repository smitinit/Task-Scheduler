import { Outlet, createFileRoute } from '@tanstack/react-router'
import Header from '@/components/DemoHeader'

export const Route = createFileRoute('/demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
