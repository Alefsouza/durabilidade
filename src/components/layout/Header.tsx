import { useAppStore } from '@/store/use-app-store'
import { Branch } from '@/types'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { currentBranch, setCurrentBranch } = useAppStore()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2" />
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Filial:</span>
          <Select value={currentBranch} onValueChange={(val) => setCurrentBranch(val as Branch)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Selecione..." />
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
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar peça, prefixo..."
            className="w-full bg-background pl-8 h-9 rounded-full"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background"></span>
        </Button>
        <Avatar className="h-9 w-9 border">
          <AvatarImage
            src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
            alt="User"
          />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
