import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Loader } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { signInWithGoogle } from '@/lib/auth/client'
import { getSessionUser } from '@/lib/session-user'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    // Redirect authenticated users to dashboard
    const user = await getSessionUser()
    if (user) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)

    try {
      // signInWithGoogle will redirect to Google's consent screen
      await signInWithGoogle()
    } catch (err: any) {
      setLoading(false)
      const message = err?.message || 'Google sign in failed'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="absolute top-4 left-4 p-2 rounded-lg hover:bg-background/80 dark:hover:bg-background/60 transition-all flex items-center gap-2 text-foreground/70 hover:text-foreground"
        aria-label="Back to home"
        title="Back to home"
      >
        <ArrowLeft size={20} />
      </button>
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
