import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/store/use-app-store'
import { TestRecord } from '@/types'

interface UpdateKmDialogProps {
  test: TestRecord | null
  open: boolean
  setOpen: (o: boolean) => void
}

export function UpdateKmDialog({ test, open, setOpen }: UpdateKmDialogProps) {
  const { updateTestKm } = useAppStore()
  const [km, setKm] = useState('')

  const handleSave = () => {
    if (test && km && Number(km) > test.startKm) {
      updateTestKm(test.id, Number(km))
      setOpen(false)
      setKm('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Atualizar KM Atual</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>KM Atual do Veículo</Label>
            <Input type="number" value={km} onChange={(e) => setKm(e.target.value)} placeholder="Ex: 155000" />
            <p className="text-xs text-muted-foreground">KM Inicial foi: {test?.startKm.toLocaleString()}</p>
          </div>
          <Button onClick={handleSave} className="w-full">Atualizar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
