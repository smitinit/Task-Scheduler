import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const taskStatusEnum = pgEnum('task_status', [
  'scheduled',
  'completed',
  'missed',
])

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),

  title: text('title').notNull(),
  description: text('description'),

  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),

  notifyBeforeMinutes: integer('notify_before_minutes').notNull().default(5),

  status: taskStatusEnum('status').notNull().default('scheduled'),

  isFocusSession: boolean('is_focus_session').notNull().default(false),

  completedAt: timestamp('completed_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
