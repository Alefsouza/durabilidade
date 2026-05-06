import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2" />
      </div>

      <div className="flex items-center gap-4">
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
