/**
 * Typed error system for consistent error handling
 * All errors throughout the app should use these types
 */

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'SESSION_EXPIRED'

export interface AppErrorData {
  code: ErrorCode
  message: string
  statusCode: number
  details?: Record<string, any>
}

/**
 * Application error class
 * Use this for all error handling in server functions and components
 */
export class AppError extends Error implements AppErrorData {
  code: ErrorCode
  statusCode: number
  details?: Record<string, any>

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    details?: Record<string, any>,
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    }
  }
}

// Error constructors for common cases
export const errors = {
  unauthorized: (message = 'Unauthorized') =>
    new AppError(message, 'UNAUTHORIZED', 401),

  forbidden: (message = 'Forbidden') => new AppError(message, 'FORBIDDEN', 403),

  notFound: (resource = 'Resource') =>
    new AppError(`${resource} not found`, 'NOT_FOUND', 404),

  badRequest: (message = 'Bad request') =>
    new AppError(message, 'BAD_REQUEST', 400),

  conflict: (message = 'Conflict') => new AppError(message, 'CONFLICT', 409),

  validation: (message: string, details?: Record<string, any>) =>
    new AppError(message, 'VALIDATION_ERROR', 400, details),

  sessionExpired: (message = 'Session expired') =>
    new AppError(message, 'SESSION_EXPIRED', 401),

  serverError: (
    message = 'Internal server error',
    details?: Record<string, any>,
  ) => new AppError(message, 'SERVER_ERROR', 500, details),
}

// Error response formatter for client consumption
export function formatErrorForClient(error: unknown) {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      code: 'SERVER_ERROR' as ErrorCode,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'An error occurred',
      statusCode: 500,
    }
  }

  return {
    code: 'SERVER_ERROR' as ErrorCode,
    message: 'An unknown error occurred',
    statusCode: 500,
  }
}

// Type guard
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
