import { useMemo } from 'react'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Cell } from 'recharts'

export function BrandPerformanceChart() {
  const { filteredTests, materials } = useDashboardData()

  const chartData = useMemo(() => {
    const brandMap = new Map<
      string,
      { brand: string; aprovado: number; reprovado: number; emTeste: number }
    >()

    filteredTests.forEach((test) => {
      const material = materials.find((m) => m.id === test.materialId)
      if (!material) return
      const brand = material.supplier || 'Desconhecida'

      if (!brandMap.has(brand)) {
        brandMap.set(brand, { brand, aprovado: 0, reprovado: 0, emTeste: 0 })
      }

      const stats = brandMap.get(brand)!
      if (test.status === 'aprovado') {
        stats.aprovado += 1
      } else if (test.status === 'reprovado') {
        stats.reprovado += 1
      } else if (test.status === 'ativo') {
        stats.emTeste += 1
      }
    })

    const flatData: {
      id: string
      brand: string
      status: string
      value: number
      fill: string
      isDummy?: boolean
    }[] = []

    Array.from(brandMap.values()).forEach((stat) => {
      if (stat.aprovado > 0)
        flatData.push({
          id: `${stat.brand}-aprovado`,
          brand: stat.brand,
          status: 'aprovado',
          value: stat.aprovado,
          fill: 'var(--color-aprovado)',
        })
      if (stat.reprovado > 0)
        flatData.push({
          id: `${stat.brand}-reprovado`,
          brand: stat.brand,
          status: 'reprovado',
          value: stat.reprovado,
          fill: 'var(--color-reprovado)',
        })
      if (stat.emTeste > 0)
        flatData.push({
          id: `${stat.brand}-emTeste`,
          brand: stat.brand,
          status: 'emTeste',
          value: stat.emTeste,
          fill: 'var(--color-emTeste)',
        })
    })

    const MIN_BARS = 8
    if (flatData.length > 0 && flatData.length < MIN_BARS) {
      const padding = MIN_BARS - flatData.length
      for (let i = 0; i < padding; i++) {
        flatData.push({
          id: `dummy-${i}`,
          brand: ' '.repeat(i + 1), // Invisible but unique string
          status: 'dummy',
          value: 0,
          fill: 'transparent',
          isDummy: true,
        })
      }
    }

    return flatData
  }, [filteredTests, materials])

  return (
    <Card className="border-border/50 shadow-subtle flex flex-col h-full">
      <CardHeader>
        <CardTitle>Análise por Marca</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4 pl-0">
        <ChartContainer
          config={{
            aprovado: { label: 'Aprovados', color: 'hsl(var(--success))' },
            reprovado: { label: 'Reprovados', color: 'hsl(var(--destructive))' },
            emTeste: { label: 'Em teste', color: '#FEF9C3' },
          }}
          className="min-h-[300px] w-full"
        >
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="brand"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => (value.trim() === '' ? '' : value)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />

            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload
                if (data.isDummy) return null

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
              {chartData.map((entry) => (
                <Cell key={entry.id} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                className="fill-foreground opacity-80 text-xs font-medium"
                formatter={(value: number) => (value > 0 ? value : '')}
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
