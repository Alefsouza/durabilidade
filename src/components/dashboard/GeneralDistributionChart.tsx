import { useMemo } from 'react'
import { useAppStore } from '@/store/use-app-store'
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
  const { filteredTests } = useAppStore()

  const pieData = useMemo(() => {
    const finishedTests = filteredTests.filter((t) => t.status !== 'ativo')
    const approvedTests = finishedTests.filter((t) => t.status === 'aprovado')
    const activeTestsCount = filteredTests.filter((t) => t.status === 'ativo').length

    return [
      { name: 'Aprovado', value: approvedTests.length, fill: 'var(--color-Aprovado)' },
      {
        name: 'Reprovado',
        value: finishedTests.length - approvedTests.length,
        fill: 'var(--color-Reprovado)',
      },
      { name: 'Em andamento', value: activeTestsCount, fill: 'var(--color-Em-andamento)' },
    ]
  }, [filteredTests])

  return (
    <Card className="border-border/50 shadow-subtle h-full">
      <CardHeader>
        <CardTitle>Distribuição Geral</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer
          config={{
            Aprovado: { label: 'Aprovado', color: 'hsl(var(--success))' },
            Reprovado: { label: 'Reprovado', color: 'hsl(var(--destructive))' },
            'Em-andamento': { label: 'Em andamento', color: '#FEF9C3' },
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
              nameKey="name"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
