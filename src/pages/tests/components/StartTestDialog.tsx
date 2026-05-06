import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlayCircle } from 'lucide-react'
import { useAppStore } from '@/store/use-app-store'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  materialId: z.string().min(1, 'Material é obrigatório'),
  prefix: z.string().min(2, 'Prefixo é obrigatório'),
  position: z.string().min(2, 'Posição é obrigatória'),
  startDate: z.string().min(10, 'Data inválida'),
  startKm: z.coerce.number().min(1, 'KM deve ser maior que 0'),
})

export function StartTestDialog() {
  const [open, setOpen] = useState(false)
  const { filteredMaterials, startTest, tests, currentBranch } = useAppStore()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { materialId: '', prefix: '', position: '', startDate: new Date().toISOString().split('T')[0], startKm: 0 },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Validation: Check if there's already an active test for this prefix and position
    const isOccupied = tests.some(t => t.status === 'ativo' && t.prefix === values.prefix && t.position === values.position)
    if (isOccupied) {
      toast({ title: 'Atenção', description: 'Já existe um teste ativo para este prefixo e posição. Finalize-o primeiro.', variant: 'destructive' })
      return
    }

    const material = filteredMaterials.find(m => m.id === values.materialId)
    if (!material) return

    startTest({ ...values, branch: material.branch })
    toast({ title: 'Teste Iniciado', description: 'O material foi instalado e o teste está em andamento.' })
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><PlayCircle className="mr-2 h-4 w-4" /> Iniciar Novo Teste</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Iniciar Teste de Durabilidade</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="materialId" render={({ field }) => (
              <FormItem>
                <FormLabel>Material do Estoque</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione a peça" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {filteredMaterials.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name} - {m.supplier} (PN: {m.partNumber})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="prefix" render={({ field }) => (
                <FormItem><FormLabel>Prefixo Veículo</FormLabel><FormControl><Input placeholder="Ex: V-101" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem><FormLabel>Posição Instalação</FormLabel><FormControl><Input placeholder="Ex: Roda DE" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem><FormLabel>Data Início</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="startKm" render={({ field }) => (
                <FormItem><FormLabel>KM Inicial Veículo</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="flex justify-end pt-4"><Button type="submit">Confirmar Instalação</Button></div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
