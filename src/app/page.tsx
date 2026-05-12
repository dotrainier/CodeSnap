import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { SnippetListClient } from '@/components/SnippetListClient';
import { SearchBar } from '@/components/SearchBar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import type { Snippet } from '@/lib/types';

interface PageProps {
  searchParams: Promise<{ q?: string; filter?: string; lang?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { q, filter, lang } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
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
  const publicCount = snippets.filter(s => s.is_public).length;
  const favCount = snippets.filter(s => s.is_favorite).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-violet-500" />
                <span className="text-xs font-medium text-violet-500 uppercase tracking-wider">Your Library</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Code Snippets</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Organize, highlight, and share your code beautifully.
              </p>
            </div>
            <Link href="/new" className={cn(buttonVariants(), 'gap-2 shadow-lg shadow-primary/20')}>
              <Plus className="h-4 w-4" />
              New Snippet
            </Link>
          </div>

          {/* Stats */}
          {!q && !filter && !lang && (
            <div className="flex gap-4 mb-6 flex-wrap">
              {[
                { label: 'Total', value: totalSnippets },
                { label: 'Favorites', value: favCount },
                { label: 'Public', value: publicCount },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/50">
                  <span className="text-lg font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          <SearchBar defaultValue={q} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <SnippetListClient initialSnippets={snippets} searchQuery={q} filter={filter} lang={lang} />
      </main>
    </div>
  );
}
