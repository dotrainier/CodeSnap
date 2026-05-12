'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { THEMES } from '@/lib/types';

interface CodePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  language: string;
}

export function CodePreviewModal({ open, onOpenChange, code, language }: CodePreviewModalProps) {
  const [theme, setTheme] = useState('dracula');
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (!open || !code.trim()) return;

    let cancelled = false;
    fetch('/api/highlight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, theme }),
    })
      .then(r => r.json())
      .then(d => { if (!cancelled) setHtml(d.html ?? ''); })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [open, code, language, theme]);

  const isLoading = open && html === '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-5xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Code Preview</DialogTitle>
        </DialogHeader>

        <div className='flex items-center gap-3 py-2'>
          <Label className='shrink-0'>Theme</Label>
          <Select value={theme} onValueChange={(v) => v && setTheme(v)}>
            <SelectTrigger className='w-48'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className='text-xs text-muted-foreground'>{language}</span>
        </div>

        <div className='flex-1 overflow-auto rounded-lg border'>
          {isLoading ? (
            <div className='flex items-center justify-center h-40 text-sm text-muted-foreground'>
              Loading preview...
            </div>
          ) : html ? (
            <div
              className='text-sm [&_pre]:p-6 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:leading-relaxed [&_pre]:h-full'
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className='flex items-center justify-center h-40 text-sm text-muted-foreground'>
              No code to preview yet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
