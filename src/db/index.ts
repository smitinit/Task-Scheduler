import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from './auth-schema'
import { taskStatusEnum, tasks } from './task'
import { notifications } from './notification'
import { fcmTokens } from './fcmTokens'

const sql = neon(process.env.DATABASE_URL!)

// Full schema for Drizzle
export const schema = {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
  tasks,
  taskStatusEnum,
  notifications,
  fcmTokens,
}

// Auth-only schema for Better Auth
export const authSchema = {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
}

export const db = drizzle(sql, { schema })
