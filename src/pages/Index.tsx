import { useAppStore } from '@/store/use-app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart,
  YAxis,
} from 'recharts'
import { Activity, CheckCircle2, DollarSign, PackageOpen, XCircle } from 'lucide-react'
import { FilterBar } from '@/components/FilterBar'

export default function Index() {
  const { filteredTests, filteredMaterials } = useAppStore()

  const totalTests = filteredTests.length
  const finishedTests = filteredTests.filter((t) => t.status !== 'ativo')
  const approvedTests = finishedTests.filter((t) => t.status === 'aprovado')
  const reprovedTests = finishedTests.filter((t) => t.status === 'reprovado')

  const activeTestsCount = filteredTests.filter((t) => t.status === 'ativo').length

  // Chart Data prep
  const pieData = [
    { name: 'Aprovado', value: approvedTests.length, color: 'var(--color-success)' },
    {
      name: 'Reprovado',
      value: finishedTests.length - approvedTests.length,
      color: 'var(--color-destructive)',
    },
    { name: 'Em Curso', value: activeTestsCount, color: 'var(--color-warning)' },
  ]

  // Branch analysis data
  const branches = ['SP', 'RJ', 'MG', 'RS']
  const branchData = branches.map((branch) => {
    const branchFinished = finishedTests.filter((t) => t.branch === branch)
    return {
      branch,
      aprovado: branchFinished.filter((t) => t.status === 'aprovado').length,
      reprovado: branchFinished.filter((t) => t.status === 'reprovado').length,
    }
  })

  const getMaterialName = (id: string) =>
    filteredMaterials.find((m) => m.id === id)?.name || 'Desconhecido'

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 shadow-subtle">
          <CardHeader>
            <CardTitle>Análise por Filial</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer
              config={{
                aprovado: { label: 'Aprovados', color: 'hsl(var(--success))' },
                reprovado: { label: 'Reprovados', color: 'hsl(var(--destructive))' },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={branchData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="branch" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="aprovado"
                  fill="var(--color-aprovado)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="reprovado"
                  fill="var(--color-reprovado)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/50 shadow-subtle">
          <CardHeader>
            <CardTitle>Distribuição Geral</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer
              config={{
                Aprovado: { label: 'Aprovado', color: 'hsl(var(--success))' },
                Reprovado: { label: 'Reprovado', color: 'hsl(var(--destructive))' },
                'Em Curso': { label: 'Em Curso', color: 'hsl(var(--warning))' },
              }}
              className="h-[300px] w-full max-w-[300px]"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-subtle">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTests
              .slice(-5)
              .reverse()
              .map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card/50"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{getMaterialName(test.materialId)}</span>
                    <span className="text-xs text-muted-foreground">
                      Prefixo: {test.prefix} • Posição: {test.position}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium hidden sm:block">{test.branch}</span>
                    <Badge
                      variant={
                        test.status === 'aprovado'
                          ? 'default'
                          : test.status === 'reprovado'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className={
                        test.status === 'aprovado'
                          ? 'bg-success hover:bg-success'
                          : test.status === 'reprovado'
                            ? 'bg-destructive hover:bg-destructive'
                            : 'bg-warning hover:bg-warning text-warning-foreground'
                      }
                    >
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            {filteredTests.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum teste encontrado.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
