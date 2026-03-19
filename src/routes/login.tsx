import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, Loader, LogInIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { login } from '@/action/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError(null)

    if (!email || !password) {
      setError('All fields are required')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await login({ email, password })
      queryClient.invalidateQueries({ queryKey: ['session-user'] })
      navigate({ to: '/' })
    } catch (err: any) {
      const message = err?.message || 'Invalid credentials'
      // Better error handling for JSON parsing issues
      if (message.includes('DOCTYPE') || message.includes('Unexpected token')) {
        setError('Server error: Please check your auth configuration')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <LogInIcon className="h-4 w-4" />
            )}
            Sign In
          </Button>

          <div className="text-sm text-muted-foreground text-center">
            Don't have an account?{' '}
            <span
              onClick={() => navigate({ to: '/register' })}
              className="underline cursor-pointer hover:text-foreground"
            >
              Register
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
