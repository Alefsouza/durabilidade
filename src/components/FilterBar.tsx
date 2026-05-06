import { useState, useMemo } from 'react'
import { useAppStore } from '@/store/use-app-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Branch } from '@/types'
import { Filter, X } from 'lucide-react'

export function FilterBar({ hideDate = false }: { hideDate?: boolean }) {
  const {
    currentBranch,
    setCurrentBranch,
    dateFilter,
    setDateFilter,
    prefixFilter,
    setPrefixFilter,
    brandFilter,
    setBrandFilter,
    tests,
    materials,
  } = useAppStore()

  const [localBranch, setLocalBranch] = useState<Branch>(currentBranch)
  const [localPrefix, setLocalPrefix] = useState<string>(prefixFilter)
  const [localBrand, setLocalBrand] = useState<string>(brandFilter)
  const [from, setFrom] = useState(dateFilter?.from || '')
  const [to, setTo] = useState(dateFilter?.to || '')

  const uniquePrefixes = useMemo(() => {
    return Array.from(new Set(tests.map((t) => t.prefix))).sort()
  }, [tests])

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(materials.map((m) => m.supplier))).sort()
  }, [materials])

  const handleApply = () => {
    setCurrentBranch(localBranch)
    setPrefixFilter(localPrefix)
    setBrandFilter(localBrand)
    if (from && to) {
      setDateFilter({ from, to })
    } else {
      setDateFilter(null)
    }
  }

  const handleClear = () => {
    setLocalBranch('Todas')
    setLocalPrefix('Todos')
    setLocalBrand('Todas')
    setCurrentBranch('Todas')
    setPrefixFilter('Todos')
    setBrandFilter('Todas')
    setFrom('')
    setTo('')
    setDateFilter(null)
  }

  const hasFilters =
    dateFilter ||
    currentBranch !== 'Todas' ||
    prefixFilter !== 'Todos' ||
    brandFilter !== 'Todas' ||
    from ||
    to ||
    localBranch !== 'Todas' ||
    localPrefix !== 'Todos' ||
    localBrand !== 'Todas'

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mt-2 lg:mt-0">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>

      <div className="flex-1 flex flex-row flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Filial</label>
          <Select value={localBranch} onValueChange={(v) => setLocalBranch(v as Branch)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas</SelectItem>
              <SelectItem value="SP">São Paulo (SP)</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro (RJ)</SelectItem>
              <SelectItem value="MG">Minas Gerais (MG)</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul (RS)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Prefixo</label>
          <Select value={localPrefix} onValueChange={setLocalPrefix}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {uniquePrefixes.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Marca</label>
          <Select value={localBrand} onValueChange={setLocalBrand}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas</SelectItem>
              {uniqueBrands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!hideDate && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Data Inicial</label>
              <Input
                type="date"
                className="h-9 w-[130px]"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Data Final</label>
              <Input
                type="date"
                className="h-9 w-[130px]"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-1.5 lg:ml-auto w-full lg:w-auto mt-2 lg:mt-0">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-9 w-full lg:w-auto"
              onClick={handleApply}
            >
              Aplicar
            </Button>
            {hasFilters ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 shrink-0"
                onClick={handleClear}
                title="Limpar Filtros"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
