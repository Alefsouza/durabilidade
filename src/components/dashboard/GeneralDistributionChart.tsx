import { useMemo } from 'react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Pie, PieChart, Cell } from 'recharts'

export function GeneralDistributionChart() {
  const { filteredTests } = useDashboardData()

  const pieData = useMemo(() => {
    const finishedTests = filteredTests.filter((t) => t.status !== 'ativo')
    const approvedTests = finishedTests.filter((t) => t.status === 'aprovado')
    const activeTestsCount = filteredTests.filter((t) => t.status === 'ativo').length
    const reprovedTests = finishedTests.filter((t) => t.status === 'reprovado')

    return [
      { name: 'aprovado', value: approvedTests.length, fill: 'var(--color-aprovado)' },
      { name: 'reprovado', value: reprovedTests.length, fill: 'var(--color-reprovado)' },
      { name: 'emTeste', value: activeTestsCount, fill: 'var(--color-emTeste)' },
    ].filter((item) => item.value > 0)
  }, [filteredTests])

  return (
    <Card className="border-border/50 shadow-subtle h-full">
      <CardHeader>
        <CardTitle>Distribuição Geral</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center overflow-visible">
        {pieData.length === 0 ? (
          <div className="flex h-[300px] w-full items-center justify-center text-sm text-muted-foreground">
            Nenhum dado encontrado.
          </div>
        ) : (
          <ChartContainer
            config={{
              aprovado: { label: 'Aprovados', color: 'hsl(var(--success))' },
              reprovado: { label: 'Reprovados', color: 'hsl(var(--destructive))' },
              emTeste: { label: 'Em teste', color: '#FEF9C3' },
            }}
            className="h-[300px] w-full max-w-[350px]"
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
                nameKey="name"
                stroke="none"
                label={({ cx, cy, midAngle, outerRadius, value, percent }) => {
                  if (value === 0) return null
                  const RADIAN = Math.PI / 180
                  const radius = outerRadius + 20
                  const x = cx + radius * Math.cos(-midAngle * RADIAN)
                  const y = cy + radius * Math.sin(-midAngle * RADIAN)

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="currentColor"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      className="text-xs font-medium fill-foreground opacity-80"
                    >
                      {value} ({(percent * 100).toFixed(1)}%)
                    </text>
                  )
                }}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
