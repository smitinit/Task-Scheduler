import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { tasks } from './task'

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),

  todoId: integer('todo_id')
    .references(() => tasks.id, { onDelete: 'cascade' })
    .notNull(),

  scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),

  sentAt: timestamp('sent_at', { withTimezone: true }),

  status: text('status').notNull().default('pending'),
  // pending | sent | failed

  createdAt: timestamp('created_at').defaultNow().notNull(),
})
