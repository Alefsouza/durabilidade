import { useState } from 'react'
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
  const { currentBranch, setCurrentBranch, dateFilter, setDateFilter } = useAppStore()
  const [from, setFrom] = useState(dateFilter?.from || '')
  const [to, setTo] = useState(dateFilter?.to || '')

  const handleApply = () => {
    if (from && to) {
      setDateFilter({ from, to })
    }
  }

  const handleClear = () => {
    setFrom('')
    setTo('')
    setDateFilter(null)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Filial</label>
          <Select value={currentBranch} onValueChange={(v) => setCurrentBranch(v as Branch)}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Todas as Filiais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas as Filiais</SelectItem>
              <SelectItem value="SP">São Paulo (SP)</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro (RJ)</SelectItem>
              <SelectItem value="MG">Minas Gerais (MG)</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul (RS)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!hideDate && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Data Inicial</label>
              <Input
                type="date"
                className="h-9"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-muted-foreground">Data Final</label>
              <Input
                type="date"
                className="h-9"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5 justify-end h-full">
              <label className="text-xs opacity-0 hidden sm:block">Ações</label>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={handleApply}>
                  Aplicar
                </Button>
                {dateFilter && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9"
                    onClick={handleClear}
                    title="Limpar Período"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
