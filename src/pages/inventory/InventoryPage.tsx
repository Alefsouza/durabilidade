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

export default function InventoryPage() {
  const { filteredMaterials } = useAppStore()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estoque de Cortesia</h2>
          <p className="text-muted-foreground">
            Gerencie as peças enviadas pelos fornecedores para teste.
          </p>
        </div>
        <AddMaterialDialog />
      </div>

      <Card className="border-border/50 shadow-subtle">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Materiais Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Peça</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Part Number</TableHead>
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
                  <TableCell className="text-right">{mat.expectedKm.toLocaleString()} km</TableCell>
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
                    Nenhum material encontrado para esta filial.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
