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
import { Activity, CheckCircle2, DollarSign, PackageOpen } from 'lucide-react'

export default function Index() {
  const { filteredTests, filteredMaterials } = useAppStore()

  const totalTests = filteredTests.length
  const finishedTests = filteredTests.filter((t) => t.status !== 'ativo')
  const approvedTests = finishedTests.filter((t) => t.status === 'aprovado')
  const approvalRate =
    finishedTests.length > 0 ? Math.round((approvedTests.length / finishedTests.length) * 100) : 0
  const activeTestsCount = filteredTests.filter((t) => t.status === 'ativo').length

  // Estimate savings: just a mock logic using quantity of approved items * 500 BRL
  const estimatedSavings = approvedTests.length * 500

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

  // Mocked monthly trend data
  const trendData = [
    { month: 'Out', aprovado: 2, reprovado: 1 },
    { month: 'Nov', aprovado: 3, reprovado: 0 },
    { month: 'Dez', aprovado: 5, reprovado: 2 },
    { month: 'Jan', aprovado: 4, reprovado: 1 },
    {
      month: 'Fev',
      aprovado: approvedTests.length,
      reprovado: finishedTests.length - approvedTests.length,
    },
  ]

  const getMaterialName = (id: string) =>
    filteredMaterials.find((m) => m.id === id)?.name || 'Desconhecido'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard de Durabilidade</h2>
        <p className="text-muted-foreground">Acompanhe o desempenho das peças em teste.</p>
      </div>

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
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground">Testes finalizados</p>
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
        <Card className="border-border/50 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Econ. Estimada</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {estimatedSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Baseado em itens aprovados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 shadow-subtle">
          <CardHeader>
            <CardTitle>Evolução de Testes (Últimos 5 meses)</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <ChartContainer
              config={{
                aprovado: { label: 'Aprovados', color: 'hsl(var(--success))' },
                reprovado: { label: 'Reprovados', color: 'hsl(var(--destructive))' },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={trendData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
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
