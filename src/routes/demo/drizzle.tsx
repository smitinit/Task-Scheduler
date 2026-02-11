import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { desc, eq } from 'drizzle-orm'
import { db } from '@/db/index'
import { todos } from '@/db/schema'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.query.todos.findMany({
    orderBy: [desc(todos.createdAt)],
  })
})

const createTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(todos).values({ title: data.title })
    return { success: true }
  })

const deleteTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(todos).where(eq(todos.id, data.id))
    return { success: true }
  })

export const Route = createFileRoute('/demo/drizzle')({
  component: Todo,
  loader: async () => await getTodos(),
  ssr: 'data-only',
})

function Todo() {
  const router = useRouter()
  const allTodos = Route.useLoaderData()
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('title') as string

    if (!title.trim()) return

    try {
      await createTodo({ data: { title } })
      router.invalidate()
      form.reset()
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTodo({ data: { id } })
      router.invalidate()
    } catch (error) {
      console.log('Failed to delete todo:', error)
    }
  }

  return (
    <div className="flex items-center justify-center p-4 flex-col">
      <h2 className="text-2xl font-bold mb-4">Todos</h2>

      <ul className="space-y-3 mb-6 max-w-2xl w-full">
        {allTodos.map((todo) => (
          <li key={todo.id} className="rounded-lg p-4 shadow-md border w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs">#{todo.id}</span>
                <span className="text-lg font-medium">{todo.title}</span>
              </div>
              <Button
                variant="destructive"
                onClick={() => handleDelete(todo.id)}
              >
                delete
              </Button>
            </div>
          </li>
        ))}
        {allTodos.length === 0 && (
          <li className="text-center py-8">No todos yet. Create one below!</li>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input type="text" name="title" placeholder="Add a new todo..." />
        <Button type="submit" variant={"outline"}>
          Add Todo
        </Button>
      </form>
    </div>
  )
}
