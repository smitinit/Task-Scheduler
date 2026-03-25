import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import type { AppError } from '@/lib/errors'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isAppError } from '@/lib/errors'

interface GlobalErrorBoundaryProps {
  error: any
}

export function GlobalErrorBoundary({ error }: GlobalErrorBoundaryProps) {
  const navigate = useNavigate()

  // Determine error details based on error type
  const getErrorInfo = (err: any) => {
    if (isAppError(err)) {
      const appError: AppError = err
      return {
        title: getErrorTitle(appError.code),
        message: appError.message,
        code: appError.code,
        isDev: false,
      }
    }

    if (err instanceof Error) {
      return {
        title: 'An Error Occurred',
        message:
          process.env.NODE_ENV === 'development'
            ? err.message
            : 'Something went wrong. Please try again.',
        code: 'ERROR',
        isDev: process.env.NODE_ENV === 'development',
      }
    }

    return {
      title: 'Unexpected Error',
      message: 'An unknown error occurred. Please try again.',
      code: 'UNKNOWN',
      isDev: false,
    }
  }

  const getErrorTitle = (code: string): string => {
    const titles: Record<string, string> = {
      UNAUTHORIZED: 'Session Expired',
      FORBIDDEN: 'Access Denied',
      NOT_FOUND: 'Not Found',
      BAD_REQUEST: 'Invalid Request',
      CONFLICT: 'Conflict',
      VALIDATION_ERROR: 'Validation Error',
      SESSION_EXPIRED: 'Session Expired',
      SERVER_ERROR: 'Server Error',
      ERROR: 'Something Went Wrong',
    }
    return titles[code] || 'An Error Occurred'
  }

  const getActionText = (code: string): React.ReactNode => {
    switch (code) {
      case 'UNAUTHORIZED':
      case 'SESSION_EXPIRED':
        return (
          <Button
            onClick={() => {
              // Clear session and redirect to login
              window.location.href = '/login'
            }}
            className="w-full"
          >
            Log in Again
          </Button>
        )
      case 'NOT_FOUND':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1"
            >
              Go Back
            </Button>
          </div>
        )
      default:
        return (
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload
            </Button>
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              variant="outline"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        )
    }
  }

  const errorInfo = getErrorInfo(error)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-xl">{errorInfo.title}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main error message */}
          <Alert variant="destructive">
            <AlertDescription>{errorInfo.message}</AlertDescription>
          </Alert>

          {/* Developer info in development */}
          {errorInfo.isDev && error instanceof Error && (
            <div className="bg-muted p-3 rounded text-xs font-mono text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">Stack:</p>
              <p className="whitespace-pre-wrap line-clamp-4">{error.stack}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2">{getActionText(errorInfo.code)}</div>

          {/* Additional help text */}
          <p className="text-xs text-muted-foreground text-center">
            If the problem persists, please contact support or try again later.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
