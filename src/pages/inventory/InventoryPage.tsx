import { useAppStore } from '@/store/use-app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddMaterialDialog } from './components/AddMaterialDialog'
import { FilterBar } from '@/components/FilterBar'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function InventoryPage() {
  const { filteredMaterials, isLoadingMaterials, materialsError } = useAppStore()

  return (
    <div className="space-y-6">
      {materialsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Sincronização</AlertTitle>
          <AlertDescription>{materialsError}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estoque de Cortesia</h2>
          <p className="text-muted-foreground">
            Gerencie as peças enviadas pelos fornecedores para teste.
          </p>
        </div>
        <AddMaterialDialog />
      </div>

      <FilterBar hideDate />

      <Card className="border-border/50 shadow-subtle">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Materiais Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingMaterials ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Sincronizando com o banco de dados Oracle...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Descrição (Peça)</TableHead>
                  <TableHead>Marca / Fornecedor</TableHead>
                  <TableHead>Código (PN)</TableHead>
                  <TableHead className="text-right">KM Esperado</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-center">Filial</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((mat) => (
                  <TableRow key={mat.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{mat.name}</TableCell>
                    <TableCell>{mat.supplier}</TableCell>
                    <TableCell className="font-mono text-xs">{mat.partNumber}</TableCell>
                    <TableCell className="text-right">
                      {mat.expectedKm.toLocaleString()} km
                    </TableCell>
                    <TableCell className="text-right font-medium">{mat.quantity}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                        {mat.branch}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMaterials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Nenhum material encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
