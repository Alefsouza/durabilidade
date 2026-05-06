import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Preferências do sistema.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Avisos e Notificações</CardTitle>
          <CardDescription>
            Configure como o sistema alerta sobre testes reprovados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A integração com e-mail da secretaria técnica não está habilitada nesta versão de
            demonstração.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
