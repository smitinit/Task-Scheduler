import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '@/db'
import * as schema from '@/db/schema'

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET environment variable is required')
}
if (!process.env.BETTER_AUTH_URL) {
  throw new Error('BETTER_AUTH_URL environment variable is required')
}

const authInstance = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      account: schema.account,
      session: schema.session,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
  },
  experimental: {
    joins: true,
  },
  plugins: [tanstackStartCookies()],
})

export const auth = authInstance
export default authInstance
