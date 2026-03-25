/**
 * Environment variable validation and access
 * Validates at build time and runtime that required env vars exist
 */

import { z } from 'zod'

// Client-side environment variables (available in browser)
const clientEnvSchema = z.object({
  VITE_FIREBASE_WEB_API_KEY: z.string().min(1, 'Missing Firebase API key'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Missing Firebase auth domain'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Missing Firebase project ID'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'Missing Firebase messaging sender ID'),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'Missing Firebase app ID'),
  VITE_FIREBASE_VAPID_KEY: z.string().min(1, 'Missing Firebase VAPID key'),
  VITE_BETTER_AUTH_URL: z.string().url('Invalid Better Auth URL'),
})

// Server-side environment variables (NOT available in browser, only in server functions)
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url('Invalid database URL'),
  BETTER_AUTH_SECRET: z.string().min(1, 'Missing Better Auth secret'),
  // Add more server env vars as needed
})

// Parse and validate
let clientEnv: z.infer<typeof clientEnvSchema> | null = null
let serverEnv: z.infer<typeof serverEnvSchema> | null = null

/**
 * Get validated client environment variables
 * Only call in components/client code
 */
export function getClientEnv() {
  if (!clientEnv) {
    const result = clientEnvSchema.safeParse(import.meta.env)
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new Error(
        `Invalid client environment configuration: ${errorMessages}`,
      )
    }
    clientEnv = result.data
  }
  return clientEnv
}

/**
 * Get validated server environment variables
 * Only call in server functions (will error if called in browser)
 */
export function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot access server environment variables from client')
  }

  if (!serverEnv) {
    const result = serverEnvSchema.safeParse(process.env)
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      throw new Error(
        `Invalid server environment configuration: ${errorMessages}`,
      )
    }
    serverEnv = result.data
  }
  return serverEnv
}

// Re-export types
export type ClientEnv = z.infer<typeof clientEnvSchema>
export type ServerEnv = z.infer<typeof serverEnvSchema>
