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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts'

export function BrandPerformanceChart() {
  const { filteredTests, materials } = useAppStore()

  const chartData = useMemo(() => {
    const brandMap = new Map<string, { brand: string; aprovado: number; reprovado: number }>()

    filteredTests.forEach((test) => {
      const material = materials.find((m) => m.id === test.materialId)
      if (!material) return
      const brand = material.supplier || 'Desconhecida'

      if (!brandMap.has(brand)) {
        brandMap.set(brand, { brand, aprovado: 0, reprovado: 0 })
      }

      const kmInicial = test.startKm
      const kmFinal = test.finalKm ?? test.currentKm ?? test.startKm
      const kmRodado = kmFinal - kmInicial
      const kmEsperado = material.expectedKm ?? 0

      const stats = brandMap.get(brand)!
      if (kmRodado >= kmEsperado) {
        stats.aprovado += 1
      } else {
        stats.reprovado += 1
      }
    })

    return Array.from(brandMap.values())
  }, [filteredTests, materials])

  return (
    <Card className="border-border/50 shadow-subtle flex flex-col">
      <CardHeader>
        <CardTitle>Análise por Marca</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4 pl-0">
        <ChartContainer
          config={{
            aprovado: { label: 'Aprovados', color: 'hsl(var(--success))' },
            reprovado: { label: 'Reprovados', color: 'hsl(var(--destructive))' },
          }}
          className="min-h-[300px] w-full"
        >
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="brand" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="aprovado"
              fill="var(--color-aprovado)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              <LabelList
                dataKey="aprovado"
                position="top"
                className="fill-foreground opacity-80 text-xs font-medium"
              />
            </Bar>
            <Bar
              dataKey="reprovado"
              fill="var(--color-reprovado)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              <LabelList
                dataKey="reprovado"
                position="top"
                className="fill-foreground opacity-80 text-xs font-medium"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
