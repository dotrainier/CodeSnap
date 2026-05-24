'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Eye, Edit, Star, Trash2, Copy, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { getLangColor, getLangAccent } from '@/lib/types';
import type { Snippet } from '@/lib/types';

interface SnippetCardProps {
  snippet: Snippet;
  onDelete?: (id: string) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
}

export function SnippetCard({ snippet, onDelete, onFavoriteToggle }: SnippetCardProps) {
  const [isFavorite, setIsFavorite] = useState(snippet.is_favorite);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(snippet.code);
    toast.success('Code copied!');
  }

  async function handleFavorite() {
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      const res = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: next }),
      });
      if (!res.ok) throw new Error();
      onFavoriteToggle?.(snippet.id, next);
    } catch {
      setIsFavorite(!next);
      toast.error('Failed to update favorite.');
    }
  }

  async function confirmDelete() {
    setDeleteOpen(false);
    try {
      const res = await fetch(`/api/snippets/${snippet.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      onDelete?.(snippet.id);
      toast.success('Snippet deleted.');
    } catch {
      toast.error('Failed to delete snippet.');
    }
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
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete snippet?</DialogTitle>
            <DialogDescription>
              &ldquo;{snippet.title}&rdquo; will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
