'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Code2, LogOut, User, Sun, Moon } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function Navbar({ user }: { user: SupabaseUser }) {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="h-0.5 w-full bg-primary" />
      <div className="container mx-auto flex h-13 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-linear-to-br from-primary to-violet-600 shadow-sm shadow-primary/30">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base bg-linear-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            CodeSnap
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="h-7 w-7 ring-1 ring-border hover:ring-primary/60 transition-all">
              <AvatarFallback className="text-xs bg-primary/15 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-0.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">Signed in as</span>
              </div>
              <p className="text-sm truncate text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
