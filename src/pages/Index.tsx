import { useAppStore } from '@/store/use-app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CheckCircle2, PackageOpen, XCircle } from 'lucide-react'
import { FilterBar } from '@/components/FilterBar'
import { PerformanceTable } from '@/components/dashboard/PerformanceTable'
import { BrandPerformanceChart } from '@/components/dashboard/BrandPerformanceChart'
import { BranchAnalysisChart } from '@/components/dashboard/BranchAnalysisChart'
import { GeneralDistributionChart } from '@/components/dashboard/GeneralDistributionChart'

export default function Index() {
  const { filteredTests } = useAppStore()

  const totalTests = filteredTests.length
  const finishedTests = filteredTests.filter((t) => t.status !== 'ativo')
  const approvedTests = finishedTests.filter((t) => t.status === 'aprovado')
  const reprovedTests = finishedTests.filter((t) => t.status === 'reprovado')
  const activeTestsCount = filteredTests.filter((t) => t.status === 'ativo').length

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard de Durabilidade</h2>
        <p className="text-muted-foreground">Acompanhe o desempenho das peças em teste.</p>
      </div>

      <FilterBar />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">Histórico completo</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Aprovados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedTests.length}</div>
            <p className="text-xs text-muted-foreground">Testes com sucesso</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Reprovados</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reprovedTests.length}</div>
            <p className="text-xs text-muted-foreground">Testes que falharam</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Peças em Teste</CardTitle>
            <Activity className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTestsCount}</div>
            <p className="text-xs text-muted-foreground">Rodando atualmente</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <BranchAnalysisChart />
          <BrandPerformanceChart />
        </div>
        <div className="space-y-4">
          <GeneralDistributionChart />
        </div>
      </div>

      <PerformanceTable />
    </div>
  )
}
