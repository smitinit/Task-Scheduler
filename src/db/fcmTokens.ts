import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const fcmTokens = pgTable('fcm_tokens', {
  userId: text('user_id').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
