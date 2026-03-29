import { relations } from 'drizzle-orm'
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const fcmTokens = pgTable(
  'fcm_tokens',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('fcm_tokens_token_unique').on(table.token),
    index('fcm_tokens_user_id_idx').on(table.userId),
    index('fcm_tokens_created_at_idx').on(table.createdAt),
  ],
)

export const fcmTokenRelations = relations(fcmTokens, ({ one }) => ({
  user: one(user, {
    fields: [fcmTokens.userId],
    references: [user.id],
  }),
}))
