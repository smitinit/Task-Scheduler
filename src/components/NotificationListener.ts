import { useEffect, useRef } from 'react'
import { differenceInMilliseconds } from 'date-fns'

import type { ServerTaskInput } from '@/zod/server-task-schema'
import {
  requestNotificationPermission,
  sendNotification,
} from '@/lib/notifications'

type Props = {
  tasks: Array<ServerTaskInput>
}

export default function NotificationListener({ tasks }: Props) {
  const notifiedRef = useRef<Set<number>>(new Set())
  const missedNotifiedRef = useRef<Set<number>>(new Set())
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  )

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    const now = new Date()

    tasks.forEach((task) => {
      if (!task.id) return

      const start = new Date(task.startTime)

      // -----------------------------
      // Notify BEFORE task start
      // -----------------------------
      if (
        task.status === 'scheduled' &&
        !notifiedRef.current.has(task.id) &&
        !timersRef.current.has(task.id)
      ) {
        const notifyTime = new Date(
          start.getTime() - task.notifyBeforeMinutes * 60000,
        )

        const delay = differenceInMilliseconds(notifyTime, now)

        if (delay > 0) {
          const timer = setTimeout(() => {
            sendNotification('Upcoming Task', `${task.title} starts soon.`)
            notifiedRef.current.add(task.id!)
            timersRef.current.delete(task.id!)
          }, delay)

          timersRef.current.set(task.id, timer)
        } else if (now >= notifyTime && now < start) {
          // User opened late but task not started yet
          sendNotification('Upcoming Task', `${task.title} starts soon.`)
          notifiedRef.current.add(task.id)
        }
      }

      // -----------------------------
      // Notify MISSED
      // -----------------------------
      if (!missedNotifiedRef.current.has(task.id)) {
        sendNotification('Task Missed', `${task.title} was missed.`)
        missedNotifiedRef.current.add(task.id)
      }
    })

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer))
      timersRef.current.clear()
    }
  }, [tasks])

  return null
}
