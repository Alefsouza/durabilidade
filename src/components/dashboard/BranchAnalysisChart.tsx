import { useMemo } from 'react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Cell } from 'recharts'

export function BranchAnalysisChart() {
  const { filteredTests } = useDashboardData()

  const chartData = useMemo(() => {
    const branches = ['SP', 'RJ', 'MG', 'RS']
    const flatData: { branch: string; status: string; value: number; fill: string }[] = []

    branches.forEach((branch) => {
      const branchTests = filteredTests.filter((t) => t.branch === branch)
      const aprovado = branchTests.filter((t) => t.status === 'aprovado').length
      const reprovado = branchTests.filter((t) => t.status === 'reprovado').length
      const emTeste = branchTests.filter((t) => t.status === 'ativo').length

      if (aprovado > 0)
        flatData.push({
          branch,
          status: 'aprovado',
          value: aprovado,
          fill: 'var(--color-aprovado)',
        })
      if (reprovado > 0)
        flatData.push({
          branch,
          status: 'reprovado',
          value: reprovado,
          fill: 'var(--color-reprovado)',
        })
      if (emTeste > 0)
        flatData.push({ branch, status: 'emTeste', value: emTeste, fill: 'var(--color-emTeste)' })
    })

    return flatData
  }, [filteredTests])

  return (
    <Card className="border-border/50 shadow-subtle h-full">
      <CardHeader>
        <CardTitle>Análise por Filial</CardTitle>
      </CardHeader>
      <CardContent className="pl-0 pb-4">
        <ChartContainer
          config={{
            aprovado: { label: 'Aprovados', color: 'hsl(var(--success))' },
            reprovado: { label: 'Reprovados', color: 'hsl(var(--destructive))' },
            emTeste: { label: 'Em teste', color: '#FEF9C3' },
          }}
          className="h-[300px] w-full"
        >
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="branch" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />

            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload
                const configLabel =
                  data.status === 'aprovado'
                    ? 'Aprovados'
                    : data.status === 'reprovado'
                      ? 'Reprovados'
                      : 'Em teste'
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: data.fill }} />
                      <span className="text-xs text-muted-foreground">{configLabel}</span>
                      <span className="text-xs font-bold">{data.value}</span>
                    </div>
                  </div>
                )
              }}
            />

            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                className="fill-foreground opacity-80 text-xs font-medium"
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-[2px] bg-[hsl(var(--success))]"></div>
            <span className="text-xs text-muted-foreground">Aprovados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-[2px] bg-[hsl(var(--destructive))]"></div>
            <span className="text-xs text-muted-foreground">Reprovados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-[2px] bg-[#FEF9C3]"></div>
            <span className="text-xs text-muted-foreground">Em teste</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
