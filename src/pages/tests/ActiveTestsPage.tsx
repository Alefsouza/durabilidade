import { useState } from 'react'
import { useAppStore } from '@/store/use-app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { StartTestDialog } from './components/StartTestDialog'
import { EndTestDialog } from './components/EndTestDialog'
import { UpdateKmDialog } from './components/UpdateKmDialog'
import { TestRecord } from '@/types'
import { MoreHorizontal, Flag, RefreshCw } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function ActiveTestsPage() {
  const { filteredTests, filteredMaterials } = useAppStore()
  const activeTests = filteredTests.filter(t => t.status === 'ativo')

  const [selectedTestEnd, setSelectedTestEnd] = useState<TestRecord | null>(null)
  const [endDialogOpen, setEndDialogOpen] = useState(false)
  
  const [selectedTestUpdate, setSelectedTestUpdate] = useState<TestRecord | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

  const getMaterial = (id: string) => filteredMaterials.find(m => m.id === id)

  const calculateProgress = (test: TestRecord, expectedKm: number) => {
    if (!test.currentKm || expectedKm === 0) return 0
    const achieved = test.currentKm - test.startKm
    const percent = (achieved / expectedKm) * 100
    return Math.min(Math.round(percent), 100)
  }

  const openEndDialog = (test: TestRecord) => {
    setSelectedTestEnd(test)
    setEndDialogOpen(true)
  }

  const openUpdateDialog = (test: TestRecord) => {
    setSelectedTestUpdate(test)
    setUpdateDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Testes em Andamento</h2>
          <p className="text-muted-foreground">Monitoramento de peças instaladas ativamente nos veículos.</p>
        </div>
        <StartTestDialog />
      </div>

      <Card className="border-border/50 shadow-subtle">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Frota em Teste</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Veículo / Posição</TableHead>
                <TableHead>Peça (Fornecedor)</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead className="w-[200px]">Progresso KM</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTests.map((test) => {
                const material = getMaterial(test.materialId)
                const expected = material?.expectedKm || 0
                const progress = calculateProgress(test, expected)
                const achieved = (test.currentKm || test.startKm) - test.startKm

                return (
                  <TableRow key={test.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="font-semibold">{test.prefix}</div>
                      <div className="text-xs text-muted-foreground">{test.position}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{material?.name || '---'}</div>
                      <div className="text-xs text-muted-foreground">{material?.supplier || '---'} (PN: {material?.partNumber})</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(test.startDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex justify-between text-xs">
                          <span>{achieved.toLocaleString()} km</span>
                          <span className="text-muted-foreground">{expected.toLocaleString()} km</span>
                        </div>
                        <Progress value={progress} className={`h-2 ${progress >= 100 ? 'bg-secondary [&>div]:bg-success' : 'bg-secondary [&>div]:bg-primary'}`} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openUpdateDialog(test)}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Atualizar KM
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEndDialog(test)} className="text-primary focus:text-primary">
                            <Flag className="mr-2 h-4 w-4" /> Finalizar Teste
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
              {activeTests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Nenhum teste em andamento para esta filial.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EndTestDialog test={selectedTestEnd} open={endDialogOpen} setOpen={setEndDialogOpen} />
      <UpdateKmDialog test={selectedTestUpdate} open={updateDialogOpen} setOpen={setUpdateDialogOpen} />
    </div>
  )
}
