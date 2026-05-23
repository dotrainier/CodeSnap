'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, Edit, Star, Trash2, Copy, Camera } from 'lucide-react';
import { toast } from 'sonner';
import type { Snippet } from '@/lib/types';

const LANG_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-400/15 text-yellow-600 border-yellow-400/30',
  typescript: 'bg-blue-400/15 text-blue-600 border-blue-400/30',
  python: 'bg-green-400/15 text-green-600 border-green-400/30',
  rust: 'bg-orange-400/15 text-orange-600 border-orange-400/30',
  go: 'bg-cyan-400/15 text-cyan-600 border-cyan-400/30',
  css: 'bg-pink-400/15 text-pink-600 border-pink-400/30',
  html: 'bg-red-400/15 text-red-600 border-red-400/30',
  sql: 'bg-indigo-400/15 text-indigo-600 border-indigo-400/30',
  bash: 'bg-emerald-400/15 text-emerald-600 border-emerald-400/30',
  java: 'bg-amber-400/15 text-amber-700 border-amber-400/30',
  php: 'bg-violet-400/15 text-violet-600 border-violet-400/30',
  ruby: 'bg-rose-400/15 text-rose-600 border-rose-400/30',
};

const LANG_ACCENT: Record<string, string> = {
  javascript: 'bg-yellow-400',
  typescript: 'bg-blue-500',
  python: 'bg-green-500',
  rust: 'bg-orange-500',
  go: 'bg-cyan-500',
  css: 'bg-pink-500',
  html: 'bg-red-500',
  sql: 'bg-indigo-500',
  bash: 'bg-emerald-500',
  java: 'bg-amber-500',
  php: 'bg-violet-500',
  ruby: 'bg-rose-500',
};

function getLangColor(lang: string) {
  return LANG_COLORS[lang.toLowerCase()] ?? 'bg-primary/10 text-primary border-primary/20';
}

function getLangAccent(lang: string) {
  return LANG_ACCENT[lang.toLowerCase()] ?? 'bg-primary';
}

interface SnippetCardProps {
  snippet: Snippet;
  onDelete?: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
}

export function SnippetCard({ snippet, onDelete, onFavoriteToggle }: SnippetCardProps) {
  const [isFavorite, setIsFavorite] = useState(snippet.is_favorite);

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet.code);
    toast.success('Code copied!');
  }

  async function handleFavorite() {
    const next = !isFavorite;
    setIsFavorite(next);
    await fetch(`/api/snippets/${snippet.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_favorite: next }),
    });
    onFavoriteToggle?.(snippet.id, next);
  }

  async function handleDelete() {
    if (!confirm('Delete this snippet?')) return;
    await fetch(`/api/snippets/${snippet.id}`, { method: 'DELETE' });
    onDelete?.(snippet.id);
    toast.success('Snippet deleted.');
  }

  const previewLines = snippet.code.split('\n').slice(0, 10).join('\n');
  const hasMore = snippet.code.split('\n').length > 10;
  const totalLines = snippet.code.split('\n').length;

  const timeAgo = useMemo(() =>
    new Date(snippet.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  [snippet.created_at]);

  return (
    <div className="group relative rounded-xl border border-border bg-card hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">

      {/* Language-colored top accent strip */}
      <div className={cn('h-0.75 w-full shrink-0', getLangAccent(snippet.language))} />

      {/* Header */}
      <div className="px-4 pt-3.5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate leading-tight">{snippet.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', getLangColor(snippet.language))}>
                {snippet.language}
              </span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
              {snippet.is_public && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-600 border border-emerald-400/30 font-medium">
                  Public
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleFavorite}
            className={cn(
              'shrink-0 p-1 rounded-md transition-colors',
              isFavorite
                ? 'text-amber-500 hover:text-amber-400'
                : 'text-muted-foreground/40 hover:text-amber-500'
            )}
          >
            <Star className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Code preview */}
      <div className="mx-4 mb-3 rounded-lg overflow-hidden shadow-lg">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#181825]">
          <div className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
          <div className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
          <div className="h-2 w-2 rounded-full bg-[#28c840]/80" />
          <span className="ml-auto text-[10px] text-white/25 font-mono">{totalLines} lines</span>
        </div>
        <pre
          className="text-xs px-3 pt-2 pb-3 overflow-hidden font-mono leading-relaxed max-h-44 select-none"
          style={{ background: '#1e1e2e', color: '#cdd6f4' }}
        >
          <code>{previewLines}{hasMore ? '\n···' : ''}</code>
        </pre>
      </div>

      {/* Description */}
      {snippet.description && (
        <p className="px-4 text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">{snippet.description}</p>
      )}

      {/* Tags */}
      {snippet.tags.length > 0 && (
        <div className="px-4 flex flex-wrap gap-1 mb-3">
          {snippet.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
              #{tag}
            </span>
          ))}
          {snippet.tags.length > 4 && (
            <span className="text-xs text-muted-foreground">+{snippet.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto px-3 pb-3 pt-2 border-t border-border/60 bg-muted/20 flex items-center gap-0.5">
        <Link
          href={`/snippet/${snippet.id}`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-background')}
        >
          <Eye className="h-3 w-3" />
          <span className="hidden xs:inline lg:hidden xl:inline">View</span>
        </Link>
        <Link
          href={`/snippet/${snippet.id}/edit`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-background')}
        >
          <Edit className="h-3 w-3" />
          <span className="hidden xs:inline lg:hidden xl:inline">Edit</span>
        </Link>
        <Button
          variant="ghost" size="sm"
          className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-background"
          onClick={handleCopy}
        >
          <Copy className="h-3 w-3" />
          <span className="hidden xs:inline lg:hidden xl:inline">Copy</span>
        </Button>
        <Link
          href={`/snippet/${snippet.id}?export=1`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-background')}
        >
          <Camera className="h-3 w-3" />
          <span className="hidden xs:inline lg:hidden xl:inline">Export</span>
        </Link>
        <Button
          variant="ghost" size="icon-sm"
          className="h-7 w-7 ml-auto text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
