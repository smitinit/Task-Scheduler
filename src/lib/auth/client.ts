/**
 * Client-side auth actions (browser only)
 * These are NOT server functions - they run entirely in the browser
 * and interact directly with Better Auth client
 */

import { client } from '@/lib/auth'
import { errors } from '@/lib/errors'

/**
 * Sign in with Google
 * Redirects to dashboard on success, Better Auth handles OAuth flow
 */
export async function signInWithGoogle(): Promise<void> {
  try {
    // Don't await - let Better Auth handle the OAuth redirect naturally
    await client.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/dashboard`,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Google sign in failed'
    throw errors.badRequest(message)
  }
}

/**
 * Sign in with email and password
 */
export async function emailSignIn({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<{ success: true }> {
  try {
    const result = await client.signIn.email({
      email,
      password,
    })

    if (result.error) {
      throw errors.badRequest(result.error.message || 'Invalid credentials')
    }

    return { success: true }
  } catch (error) {
    if (error instanceof errors.constructor) throw error
    throw errors.badRequest(
      error instanceof Error ? error.message : 'Login failed',
    )
  }
}

/**
 * Sign up with email and password
 */
export async function emailSignUp({
  email,
  password,
  name,
}: {
  email: string
  password: string
  name: string
}): Promise<{ success: true }> {
  try {
    const result = await client.signUp.email({
      email,
      password,
      name,
    })

    if (result.error) {
      throw errors.badRequest(result.error.message || 'Registration failed')
    }

    return { success: true }
  } catch (error) {
    if (error instanceof errors.constructor) throw error
    throw errors.badRequest(
      error instanceof Error ? error.message : 'Registration failed',
    )
  }
}

/**
 * Sign out (invalidates session cookie)
 */
export async function signOut(): Promise<{ success: true }> {
  try {
    const result = await client.signOut()

    if (result.error) {
      throw errors.badRequest(result.error.message || 'Logout failed')
    }

    return { success: true }
  } catch (error) {
    if (error instanceof errors.constructor) throw error
    throw errors.badRequest(
      error instanceof Error ? error.message : 'Logout failed',
    )
  }
}
