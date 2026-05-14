'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SnippetCard } from '@/components/SnippetCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Code2, Plus } from 'lucide-react';
import type { Snippet } from '@/lib/types';

interface SnippetListClientProps {
  initialSnippets: Snippet[];
  searchQuery?: string;
  filter?: string;
  lang?: string;
}

const FILTERS = [
  { value: undefined, label: 'All' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'public', label: 'Public' },
];

export function SnippetListClient({ initialSnippets, searchQuery, filter, lang }: SnippetListClientProps) {
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets);

  function handleDelete(id: string) {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  }

  function handleFavoriteToggle(id: string, isFavorite: boolean) {
    setSnippets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_favorite: isFavorite } : s))
    );
  }

  const languages = Array.from(new Set(snippets.map((s) => s.language))).sort();

  return (
    <div className="space-y-6">
      {/* Filter tabs + language row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-1 border-b border-border/50">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/40">
          {FILTERS.map((f) => {
            const active = (filter ?? undefined) === f.value;
            return (
              <Link
                key={f.label}
                href={buildUrl({ filter: f.value, lang, q: searchQuery })}
                className={cn(
                  'px-4 py-1.5 text-sm rounded-lg font-medium transition-all',
                  active
                    ? 'bg-card text-foreground shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center sm:ml-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Lang:</span>
            <Link
              href={buildUrl({ filter, q: searchQuery })}
              className={cn(
                'text-xs px-2.5 py-1 rounded-full font-medium transition-all border',
                !lang ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground border-transparent hover:border-border/60 hover:bg-accent'
              )}
            >
              All
            </Link>
            {languages.map((l) => (
              <Link
                key={l}
                href={buildUrl({ filter, lang: l, q: searchQuery })}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-medium transition-all border',
                  lang === l ? 'bg-primary/10 text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground border-transparent hover:border-border/60 hover:bg-accent'
                )}
              >
                {l}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Results header */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          {snippets.length} result{snippets.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      {/* Snippet grid */}
      {snippets.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-linear-to-br from-primary/20 to-violet-500/10 shadow-inner ring-1 ring-primary/10">
            <Code2 className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">No snippets yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Save your first code snippet to start building your library.
            </p>
          </div>
          <Link href="/new" className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 mt-1')}>
            <Plus className="h-3.5 w-3.5" />
            Create your first snippet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onDelete={handleDelete}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function buildUrl({ filter, lang, q }: { filter?: string; lang?: string; q?: string }) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (filter) params.set('filter', filter);
  if (lang) params.set('lang', lang);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export { Badge };
