
import { Bell, Search, Calendar, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl transition-all duration-200 supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 gap-4">
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground/90">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground hidden md:block">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden md:flex items-center w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients, doctors, records..."
              className="w-80 rounded-full bg-secondary/50 border-transparent pl-9 focus:bg-background focus:border-primary/20 transition-all font-medium text-sm"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-full">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
          </Button>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-full hidden md:flex">
            <Calendar className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/10">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">DR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Ayesha Malik</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    ayesha.malik@clinic.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
