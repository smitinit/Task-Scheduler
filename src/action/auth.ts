import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { db } from '@/db'
import { users } from '@/db/schema'
import { lucia } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/password'
import { getCurrentSession } from '@/lib/sessions'

/* ================================
   LOGIN
================================ */

export const login = createServerFn({
  method: 'POST',
})
  .inputValidator(
    z.object({
      email: z.email(),
      password: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const valid = await verifyPassword(data.password, user.hashedPassword)

    if (!valid) {
      throw new Error('Invalid credentials')
    }

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    setResponseHeader('Set-Cookie', sessionCookie.serialize())

    return { success: true }
  })

/* ================================
   REGISTER
================================ */

export const register = createServerFn({
  method: 'POST',
})
  .inputValidator(
    z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(8),
    }),
  )
  .handler(async ({ data }) => {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })

    if (existing) {
      throw new Error('Email already registered')
    }

    const userId = generateId(15)
    const hashed = await hashPassword(data.password)

    await db.insert(users).values({
      id: userId,
      name: data.name,
      email: data.email,
      hashedPassword: hashed,
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    setResponseHeader('Set-Cookie', sessionCookie.serialize())

    return { success: true }
  })

/* ================================
   LOGOUT
================================ */

export const logout = createServerFn({
  method: 'POST',
}).handler(async () => {
  const { session } = await getCurrentSession()

  if (session) {
    await lucia.invalidateSession(session.id)
  }

  const blankCookie = lucia.createBlankSessionCookie()

  setResponseHeader('Set-Cookie', blankCookie.serialize())

  return { success: true }
})
