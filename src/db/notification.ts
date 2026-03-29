import { relations } from 'drizzle-orm'
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { tasks } from './task'

export const notificationTypeEnum = pgEnum('notification_type', [
  'reminder',
  'missed',
])

export const notificationStatusEnum = pgEnum('notification_status', [
  'pending',
  'processing',
  'sent',
  'failed',
  'cancelled',
])

export const notifications = pgTable(
  'notifications',
  {
    id: serial('id').primaryKey(),
    taskId: integer('task_id')
      .references(() => tasks.id, { onDelete: 'cascade' })
      .notNull(),
    type: notificationTypeEnum('type').notNull(),
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    status: notificationStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('notifications_task_id_idx').on(table.taskId),
    index('notifications_status_scheduled_for_idx').on(
      table.status,
      table.scheduledFor,
    ),
    index('notifications_created_at_idx').on(table.createdAt),
    uniqueIndex('notifications_task_type_scheduled_for_uniq').on(
      table.taskId,
      table.type,
      table.scheduledFor,
    ),
  ],
)

export const notificationRelations = relations(notifications, ({ one }) => ({
  task: one(tasks, {
    fields: [notifications.taskId],
    references: [tasks.id],
  }),
}))
