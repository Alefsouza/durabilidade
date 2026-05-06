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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

export function BranchAnalysisChart() {
  const { filteredTests } = useAppStore()

  const branchData = useMemo(() => {
    const branches = ['SP', 'RJ', 'MG', 'RS']
    const finishedTests = filteredTests.filter((t) => t.status !== 'ativo')

    return branches.map((branch) => {
      const branchFinished = finishedTests.filter((t) => t.branch === branch)
      return {
        branch,
        aprovado: branchFinished.filter((t) => t.status === 'aprovado').length,
        reprovado: branchFinished.filter((t) => t.status === 'reprovado').length,
      }
    })
  }, [filteredTests])

  return (
    <Card className="border-border/50 shadow-subtle h-full">
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
  )
}
