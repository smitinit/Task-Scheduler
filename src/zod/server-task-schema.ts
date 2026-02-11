import { z } from 'zod'

export const taskStatusEnum = z.enum(['scheduled', 'completed', 'missed'])

export const serverTaskSchema = z
  .object({
    id: z.number().optional(),

    title: z.string().min(3).max(120),

    description: z.string().max(2000).optional().or(z.literal('')),

    startTime: z.date(),
    endTime: z.date(),

    notifyBeforeMinutes: z.number().min(0).default(5),

    status: taskStatusEnum.default('scheduled'),

    isFocusSession: z.boolean().default(false),

    completedAt: z.date().optional().nullable(),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })
  .refine(
    (data) => (data.status === 'completed' ? data.completedAt != null : true),
    {
      message: 'Completed tasks must have completedAt',
      path: ['completedAt'],
    },
  )
  .refine(
    (data) => {
      const duration =
        (data.endTime.getTime() - data.startTime.getTime()) / 1000 / 60

      return data.notifyBeforeMinutes < duration
    },
    {
      message: 'Notify time must be less than task duration',
      path: ['notifyBeforeMinutes'],
    },
  )

export type ServerTaskInput = z.infer<typeof serverTaskSchema>
