import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { KeyRound } from 'lucide-react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('thiago.araujo@viasudeste.com')
  const [password, setPassword] = useState('Skip@Pass')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: signInError } = await signIn(email, password)
    if (signInError) setError('Credenciais inválidas. Verifique e tente novamente.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-subtle border-border/50">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-2">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Acesso ao Sistema</CardTitle>
          <CardDescription>Controle de Durabilidade de Peças</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Input
                placeholder="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
