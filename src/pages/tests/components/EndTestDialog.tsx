import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/use-app-store'
import { useToast } from '@/hooks/use-toast'
import { TestRecord } from '@/types'

const formSchema = z.object({
  endDate: z.string().min(10, 'Data inválida'),
  finalKm: z.coerce.number().min(1, 'KM deve ser maior que 0'),
})

interface EndTestDialogProps {
  test: TestRecord | null
  open: boolean
  setOpen: (o: boolean) => void
}

export function EndTestDialog({ test, open, setOpen }: EndTestDialogProps) {
  const { endTest } = useAppStore()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { endDate: new Date().toISOString().split('T')[0], finalKm: 0 },
  })

  // Update default value when test changes
  if (test && form.getValues('finalKm') === 0 && test.currentKm) {
    form.setValue('finalKm', test.currentKm)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!test) return
    if (values.finalKm <= test.startKm) {
      form.setError('finalKm', { message: 'KM final deve ser maior que KM inicial' })
      return
    }

    endTest(test.id, values.finalKm, values.endDate)
    toast({ title: 'Teste Finalizado', description: 'Cálculo de durabilidade realizado com sucesso.' })
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Finalizar Teste e Registrar Substituição</DialogTitle>
        </DialogHeader>
        {test && (
          <div className="bg-muted p-3 rounded-md mb-2 text-sm">
            <p><strong>Prefixo:</strong> {test.prefix} - <strong>Posição:</strong> {test.position}</p>
            <p><strong>KM Inicial:</strong> {test.startKm.toLocaleString()} km</p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="endDate" render={({ field }) => (
              <FormItem><FormLabel>Data Término</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="finalKm" render={({ field }) => (
              <FormItem><FormLabel>KM Final Veículo</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end pt-4"><Button type="submit" variant="default">Calcular Resultado</Button></div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
