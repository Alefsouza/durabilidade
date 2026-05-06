import { useAppStore } from '@/store/use-app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function HistoryTestsPage() {
  const { filteredTests, filteredMaterials } = useAppStore()
  const historyTests = filteredTests.filter(t => t.status !== 'ativo').sort((a, b) => new Date(b.endDate || '').getTime() - new Date(a.endDate || '').getTime())

  const getMaterial = (id: string) => filteredMaterials.find(m => m.id === id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Histórico de Testes</h2>
        <p className="text-muted-foreground">Registro de todas as peças que já finalizaram o ciclo de testes.</p>
      </div>

      <Card className="border-border/50 shadow-subtle">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Testes Concluídos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Resultado</TableHead>
                <TableHead>Veículo / Posição</TableHead>
                <TableHead>Peça (Fornecedor)</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">KM Realizado</TableHead>
                <TableHead className="text-right">KM Esperado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyTests.map((test) => {
                const material = getMaterial(test.materialId)
                const expected = material?.expectedKm || 0
                const achieved = (test.finalKm || 0) - test.startKm
                const isApproved = test.status === 'aprovado'

                return (
                  <TableRow key={test.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <Badge variant={isApproved ? 'default' : 'destructive'}
                        className={isApproved ? 'bg-success hover:bg-success' : 'bg-destructive hover:bg-destructive'}>
                        {isApproved ? 'Aprovado' : 'Reprovado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{test.prefix}</div>
                      <div className="text-xs text-muted-foreground">{test.position}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{material?.name || '---'}</div>
                      <div className="text-xs text-muted-foreground">{material?.supplier || '---'}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{new Date(test.startDate).toLocaleDateString('pt-BR')}</div>
                      <div className="text-muted-foreground">até {test.endDate ? new Date(test.endDate).toLocaleDateString('pt-BR') : '---'}</div>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${isApproved ? 'text-success' : 'text-destructive'}`}>
                      {achieved.toLocaleString()} km
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {expected.toLocaleString()} km
                    </TableCell>
                  </TableRow>
                )
              })}
              {historyTests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    Nenhum histórico encontrado para esta filial.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
