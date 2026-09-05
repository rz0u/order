import { ThemeToggle } from './ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function TopHeader() {
  return (
    <header className="flex h-12 items-center justify-end border-b border-border/40 bg-background/70 backdrop-blur-md px-4 lg:px-6 gap-2">
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex h-7 w-7 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors">
          <Avatar className="h-7 w-7">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="text-[10px]">U</AvatarFallback>
          </Avatar>
          <span className="sr-only">User menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs">Profile</DropdownMenuItem>
          <DropdownMenuItem className="text-xs">Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-destructive">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
