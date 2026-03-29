import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const taskStatusEnum = pgEnum('task_status', [
  'scheduled',
  'completed',
  'missed',
])

export const tasks = pgTable(
  'tasks',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

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
  },
  (table) => [index('tasks_user_id_idx').on(table.userId)],
)

export const taskRelations = relations(tasks, ({ one }) => ({
  user: one(user, {
    fields: [tasks.userId],
    references: [user.id],
  }),
}))
