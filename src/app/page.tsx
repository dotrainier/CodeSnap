import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { SnippetListClient } from '@/components/SnippetListClient';
import { SearchBar } from '@/components/SearchBar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus, Code2, BookMarked, Star, Globe } from 'lucide-react';
import type { Snippet } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{ q?: string; filter?: string; lang?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { q, filter, lang } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  let query = supabase
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,code.ilike.%${q}%`);
  if (filter === 'favorites') query = query.eq('is_favorite', true);
  if (filter === 'public') query = query.eq('is_public', true);
  if (lang) query = query.eq('language', lang);

  const { data } = await query;
  const snippets = (data ?? []) as Snippet[];

  const totalSnippets = snippets.length;
  const publicCount = snippets.filter((s) => s.is_public).length;
  const favCount = snippets.filter((s) => s.is_favorite).length;

  return (
    <div className='min-h-screen bg-background'>
      <Navbar user={user} />

      <div className='relative overflow-hidden border-b border-border'>
        <div className='absolute inset-0 bg-linear-to-br from-primary/8 via-background to-violet-500/5 pointer-events-none' />
        <div className='absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none' />
        <div className='absolute top-4 left-1/3 h-24 w-48 rounded-full bg-violet-400/8 blur-2xl pointer-events-none' />
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 relative max-w-7xl'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6'>
            <div className='flex items-center gap-3.5'>
              <div className='flex items-center justify-center h-11 w-11 rounded-xl bg-linear-to-br from-primary to-violet-600 shadow-lg shadow-primary/25 shrink-0'>
                <Code2 className='h-5.5 w-5.5 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold tracking-tight'>Code Snippets</h1>
                <p className='text-sm text-muted-foreground mt-0.5'>
                  Your personal snippet library
                </p>
              </div>
            </div>
            <Link
              href='/new'
              className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 shrink-0 shadow-sm')}
            >
              <Plus className='h-3.5 w-3.5' />
              New Snippet
            </Link>
          </div>

          {!q && !filter && !lang && (
            <div className='grid grid-cols-3 gap-2 sm:gap-3 mb-6 max-w-sm'>
              <div className='flex flex-col gap-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-border/60 shadow-sm'>
                <div className='flex items-center gap-1 sm:gap-1.5'>
                  <BookMarked className='h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0' />
                  <span className='text-xs text-muted-foreground font-medium truncate'>Total</span>
                </div>
                <span className='text-xl sm:text-2xl font-bold tracking-tight'>
                  {totalSnippets}
                </span>
              </div>
              <div className='flex flex-col gap-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-amber-400/20 shadow-sm'>
                <div className='flex items-center gap-1 sm:gap-1.5'>
                  <Star className='h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 shrink-0' />
                  <span className='text-xs text-muted-foreground font-medium truncate'>
                    Starred
                  </span>
                </div>
                <span className='text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400'>
                  {favCount}
                </span>
              </div>
              <div className='flex flex-col gap-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-card border border-emerald-400/20 shadow-sm'>
                <div className='flex items-center gap-1 sm:gap-1.5'>
                  <Globe className='h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500 shrink-0' />
                  <span className='text-xs text-muted-foreground font-medium truncate'>Public</span>
                </div>
                <span className='text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400'>
                  {publicCount}
                </span>
              </div>
            </div>
          )}

          <SearchBar defaultValue={q} />
        </div>
      </div>

      <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl'>
        <SnippetListClient initialSnippets={snippets} searchQuery={q} filter={filter} lang={lang} />
      </main>
    </div>
  );
}
