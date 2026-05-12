'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Code2, LogOut, User } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function Navbar({ user }: { user: SupabaseUser }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base bg-linear-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
            CodeSnap
          </span>
        </Link>

        {/* Right side */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-primary/50 transition-all">
              <AvatarFallback className="text-xs bg-linear-to-br from-violet-500 to-indigo-600 text-white font-semibold">
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
    </header>
  );
}
