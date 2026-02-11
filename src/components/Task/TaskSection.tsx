import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import TaskCard from './TaskCard'
import EmptyState from './EmptyState'
import type { ServerTaskInput } from '@/zod/server-task-schema'

export default function TaskSection({
  title,
  tasks,
  collapsible = false,
}: {
  title: string
  tasks: Array<ServerTaskInput>
  collapsible?: boolean
}) {
  const [open, setOpen] = useState(true)

  if (!tasks.length && title === 'Today') return <EmptyState />

  if (!tasks.length) return null

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => collapsible && setOpen(!open)}
      >
        <h2 className="text-lg font-medium">{title}</h2>

        {collapsible && (
          <ChevronDown
            className={`transition-transform ${open ? '' : 'rotate-180'}`}
            size={18}
          />
        )}
      </div>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
