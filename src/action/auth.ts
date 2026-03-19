import { client } from '@/lib/auth'

/* ================================
   LOGIN - Client-side only
================================ */

export const login = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  try {
    const result = await client.signIn.email({
      email,
      password,
    })

    if (result.error) {
      throw new Error(result.error.message || 'Invalid credentials')
    }

    return { success: true }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed')
  }
}

/* ================================
   REGISTER - Client-side only
================================ */

export const register = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) => {
  try {
    const result = await client.signUp.email({
      email,
      password,
      name,
    })

    if (result.error) {
      throw new Error(result.error.message || 'Registration failed')
    }

    return { success: true }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Registration failed',
    )
  }
}

/* ================================
   LOGOUT - Client-side only
================================ */

export const logout = async () => {
  try {
    const result = await client.signOut()

    if (result.error) {
      throw new Error(result.error.message || 'Logout failed')
    }

    return { success: true }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Logout failed')
  }
}
