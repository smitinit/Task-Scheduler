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
    <div>
      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => collapsible && setOpen(!open)}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h2>

        {collapsible && (
          <ChevronDown
            className={`transition-transform ${open ? '' : 'rotate-180'}`}
            size={18}
          />
        )}
      </div>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
