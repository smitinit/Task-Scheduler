import { z } from 'zod'

export const taskSchema = z
  .object({
    id: z.number().optional(),

    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(120, 'Title too long'),

    description: z
      .string()
      .max(2000, 'Description too long')
      .optional()
      .or(z.literal('')),

    startTime: z.string().min(1, 'Start time required'),
    endTime: z.string().min(1, 'End time required'),

    notifyBeforeMinutes: z.number().min(0, 'Cannot be negative'),
    isFocusSession: z.boolean(),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  })
  .refine((data) => new Date(data.endTime) > new Date(), {
    message: 'End time must be in the future',
    path: ['endTime'],
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime)
      const end = new Date(data.endTime)

      const duration = (end.getTime() - start.getTime()) / 1000 / 60

      return data.notifyBeforeMinutes < duration
    },
    {
      message: 'Notify time must be less than task duration',
      path: ['notifyBeforeMinutes'],
    },
  )

export type TaskFormValues = z.infer<typeof taskSchema>
