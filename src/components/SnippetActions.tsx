'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { ExportModal } from '@/components/ExportModal';
import { cn } from '@/lib/utils';
import { Copy, Camera, Edit, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Snippet } from '@/lib/types';

export function SnippetActions({
  snippet,
  openExport = false,
}: {
  snippet: Snippet;
  openExport?: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(snippet.is_favorite);
  const [exportOpen, setExportOpen] = useState(openExport);

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
    toast.success(next ? 'Added to favorites!' : 'Removed from favorites.');
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Link
            href={`/snippet/${snippet.id}/edit`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Link>
        </div>
        <Button
          size="sm"
          onClick={() => setExportOpen(true)}
          className="w-full gap-1.5 shadow-sm shadow-primary/20"
        >
          <Camera className="h-3.5 w-3.5" /> Export as Image
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavorite}
          className={cn('w-full gap-1.5', isFavorite ? 'text-amber-500 hover:text-amber-400' : 'text-muted-foreground')}
        >
          <Star className="h-3.5 w-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
          {isFavorite ? 'Starred' : 'Add to Favorites'}
        </Button>
      </div>

      <ExportModal snippet={snippet} open={exportOpen} onOpenChange={setExportOpen} />
    </>
  );
}
