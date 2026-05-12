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
      <div className="flex gap-2 shrink-0 flex-wrap justify-end">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleFavorite}
          className={isFavorite ? 'text-yellow-500' : ''}
        >
          <Star className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-1" /> Copy
        </Button>
        <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
          <Camera className="h-4 w-4 mr-1" /> Export
        </Button>
        <Link
          href={`/snippet/${snippet.id}/edit`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Link>
      </div>

      <ExportModal snippet={snippet} open={exportOpen} onOpenChange={setExportOpen} />
    </>
  );
}
