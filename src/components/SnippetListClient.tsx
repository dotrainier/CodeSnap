'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SnippetCard } from '@/components/SnippetCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import type { Snippet } from '@/lib/types';

interface SnippetListClientProps {
  initialSnippets: Snippet[];
  searchQuery?: string;
  filter?: string;
  lang?: string;
}

const FILTERS = [
  { value: undefined, label: 'All Snippets' },
  { value: 'favorites', label: 'Favorites ⭐' },
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
      {/* Filter tabs */}
      <div className="flex gap-1 border-b">
        {FILTERS.map((f) => {
          const active = (filter ?? undefined) === f.value;
          return (
            <Link
              key={f.label}
              href={buildUrl({ filter: f.value, lang, q: searchQuery })}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                active
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Language filters */}
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">Language:</span>
          <Link
            href={buildUrl({ filter, q: searchQuery })}
            className={cn('text-xs px-2 py-0.5 rounded', !lang ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground')}
          >
            All
          </Link>
          {languages.map((l) => (
            <Link
              key={l}
              href={buildUrl({ filter, lang: l, q: searchQuery })}
              className={cn('text-xs px-2 py-0.5 rounded', lang === l ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground')}
            >
              {l}
            </Link>
          ))}
        </div>
      )}

      {/* Results header */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          {snippets.length} result{snippets.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      {/* Snippet grid */}
      {snippets.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-muted-foreground text-lg">No snippets yet.</p>
          <p className="text-sm text-muted-foreground">Save your first code snippet to get started.</p>
          <Link href="/new" className={cn(buttonVariants())}>
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
