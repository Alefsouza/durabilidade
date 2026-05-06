import { useDashboardData } from '@/hooks/use-dashboard-data'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PerformanceTable() {
  const { filteredTests, materials } = useDashboardData()

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const parts = dateStr.split('-')
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
    return dateStr
  }

  return (
    <Card className="border-border/50 shadow-subtle overflow-hidden">
      <CardHeader>
        <CardTitle>Performance Detalhada</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="whitespace-nowrap">Início</TableHead>
              <TableHead className="whitespace-nowrap">Término</TableHead>
              <TableHead className="whitespace-nowrap">Prefixo</TableHead>
              <TableHead className="whitespace-nowrap">Posicao</TableHead>
              <TableHead className="whitespace-nowrap">Material</TableHead>
              <TableHead className="whitespace-nowrap">Marca</TableHead>
              <TableHead className="min-w-[300px]">Material</TableHead>
              <TableHead className="text-right whitespace-nowrap">KM_Inicial</TableHead>
              <TableHead className="text-right whitespace-nowrap">KM_Final</TableHead>
              <TableHead className="text-right whitespace-nowrap">KM Rodado</TableHead>
              <TableHead className="text-right whitespace-nowrap">Km esperado</TableHead>
              <TableHead className="text-right whitespace-nowrap">Diferença KM</TableHead>
              <TableHead className="text-right whitespace-nowrap">Diferença %</TableHead>
              <TableHead className="whitespace-nowrap">Status_Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTests.map((test) => {
              const material = materials.find((m) => m.id === test.materialId)
              const kmInicial = test.startKm
              const kmFinal = test.finalKm ?? test.currentKm ?? test.startKm
              const kmRodado = kmFinal - kmInicial
              const kmEsperado = material?.expectedKm ?? 0
              const diffKm = kmRodado - kmEsperado
              const diffPercent = kmEsperado > 0 ? diffKm / kmEsperado : 0

              let rowClass = ''
              if (test.status === 'aprovado') {
                rowClass = 'bg-success text-success-foreground hover:bg-success/90'
              } else if (test.status === 'reprovado') {
                rowClass = 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              } else {
                rowClass = 'bg-[#FEF9C3] text-yellow-900 hover:bg-[#FEF9C3]/90'
              }

              return (
                <TableRow key={test.id} className={rowClass}>
                  <TableCell className="whitespace-nowrap">{formatDate(test.startDate)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(test.endDate)}</TableCell>
                  <TableCell>{test.prefix}</TableCell>
                  <TableCell>{test.position}</TableCell>
                  <TableCell>{material?.partNumber}</TableCell>
                  <TableCell>{material?.supplier}</TableCell>
                  <TableCell className="font-medium">{material?.name}</TableCell>
                  <TableCell className="text-right">{kmInicial}</TableCell>
                  <TableCell className="text-right">{kmFinal}</TableCell>
                  <TableCell className="text-right">{kmRodado}</TableCell>
                  <TableCell className="text-right">{kmEsperado}</TableCell>
                  <TableCell className="text-right">{diffKm}</TableCell>
                  <TableCell className="text-right">{formatPercentage(diffPercent)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {test.status === 'aprovado' ? (
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-current"></span>
                        Aprovado
                      </span>
                    ) : test.status === 'reprovado' ? (
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-current"></span>
                        Reprovado
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-current"></span>
                        Em teste
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {filteredTests.length === 0 && (
              <TableRow>
                <TableCell colSpan={14} className="h-24 text-center">
                  Nenhum teste encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
