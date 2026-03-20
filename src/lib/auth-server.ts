import '@tanstack/react-start/server-only'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { authSchema, db } from '@/db'

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET environment variable is required')
}
if (!process.env.BETTER_AUTH_URL) {
  throw new Error('BETTER_AUTH_URL environment variable is required')
}

const authInstance = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURL: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },
  experimental: {
    joins: true,
  },
  plugins: [tanstackStartCookies()],
})

export const auth = authInstance
export default authInstance
