import { createAuthClient } from 'better-auth/react'

export const client = createAuthClient({
  baseURL: process.env.VITE_BETTER_AUTH_URL,
})

export const { signUp, signIn, signOut, useSession } = client
