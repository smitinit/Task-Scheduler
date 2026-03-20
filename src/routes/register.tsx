import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { signInWithGoogle } from '@/action/auth'
import { useUser } from '@/hooks/useUser'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useUser()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (user) {
    return null // Will redirect, so don't render anything
  }

  const handleGoogleSignIn = () => {
    setError(null)
    setLoading(true)

    try {
      // Don't await - let Better Auth handle the OAuth redirect to Google
      // This will redirect to Google's consent screen, not to /dashboard
      signInWithGoogle()
    } catch (err: any) {
      setLoading(false)
      const message = err?.message || 'Google sign in failed'
      // Better error handling for JSON parsing issues
      if (message.includes('DOCTYPE') || message.includes('Unexpected token')) {
        setError('Server error: Please check your auth configuration')
      } else {
        setError(message)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-xl border">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="outline"
              size="lg"
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FcGoogle className="h-4 w-4 mr-2" />
              )}
              Sign up with Google
            </Button>

            <div className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <span
                onClick={() => navigate({ to: '/login' })}
                className="underline cursor-pointer hover:text-foreground"
              >
                Login
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
