import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

export default defineConfig({
  schema: [
    './src/db/auth-schema.ts',
    './src/db/task.ts',
    './src/db/notification.ts',
    './src/db/fcmTokens.ts',
  ],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
