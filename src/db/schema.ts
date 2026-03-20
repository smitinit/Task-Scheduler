import { taskStatusEnum, tasks } from './task'
import { notifications } from './notification'
import { fcmTokens } from './fcmTokens'
import {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from './auth-schema'

// Unified schema object for Drizzle Adapter
export const schema = {
  account,
  accountRelations,
  fcmTokens,
  notifications,
  session,
  sessionRelations,
  taskStatusEnum,
  tasks,
  user,
  userRelations,
  verification,
}

// Auth schema for Better Auth
export const authSchema = {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
}
