import { useMemo } from 'react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TestEvolutionChart() {
  const { filteredTests } = useDashboardData()

  const chartData = useMemo(() => {
    const groupByYYYYMM = filteredTests.reduce(
      (acc, test) => {
        if (!test.startDate) return acc
        const prefix = test.startDate.substring(0, 7) // YYYY-MM
        if (!acc[prefix]) acc[prefix] = 0
        acc[prefix]++
        return acc
      },
      {} as Record<string, number>,
    )

    const sorted = Object.entries(groupByYYYYMM).sort((a, b) => a[0].localeCompare(b[0]))

    return sorted.map(([ym, count]) => {
      const [year, month] = ym.split('-')
      const d = new Date(parseInt(year), parseInt(month) - 1, 1)
      return {
        month: format(d, 'MMM/yy', { locale: ptBR }),
        testes: count,
      }
    })
  }, [filteredTests])

  return (
    <Card className="border-border/50 shadow-subtle h-full">
      <CardHeader>
        <CardTitle>Evolução de Testes</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[300px] w-full items-center justify-center text-sm text-muted-foreground">
            Nenhum dado encontrado para os filtros selecionados.
          </div>
        ) : (
          <ChartContainer
            config={{
              testes: { label: 'Testes Iniciados', color: '#6b7280' },
            }}
            className="h-[300px] w-full"
          >
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--muted-foreground)/0.2)"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                allowDecimals={false}
                stroke="hsl(var(--muted-foreground))"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="testes"
                stroke="var(--color-testes)"
                strokeWidth={2}
                dot={{ r: 4, fill: 'var(--color-testes)', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
