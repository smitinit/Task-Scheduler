import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { tasks } from './task'

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),

  taskId: integer('task_id')
    .references(() => tasks.id, { onDelete: 'cascade' })
    .notNull(),

  type: text('type').notNull(), // 'reminder' | 'missed'

  scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),

  sentAt: timestamp('sent_at', { withTimezone: true }),

  status: text('status').notNull().default('pending'),
  // pending | sent | failed | cancelled

  createdAt: timestamp('created_at').defaultNow().notNull(),
})
