import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/task/$taskId')({
  component: RouteComponent,
  loader: ({ params }) => {
    return {
      taskId: params.taskId,
    }
  },
})

function RouteComponent() {
  const { taskId } = Route.useLoaderData()
  return <div>Hello {taskId}!</div>
}
