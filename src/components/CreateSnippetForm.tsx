'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CodePreviewModal } from '@/components/CodePreviewModal';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { X, Eye, Tag, FileText, Globe, Lock, Code2, Info } from 'lucide-react';
import { LANGUAGES } from '@/lib/types';
import type { Snippet } from '@/lib/types';

interface CreateSnippetFormProps {
  snippet?: Snippet;
}

export function CreateSnippetForm({ snippet }: CreateSnippetFormProps) {
  const router = useRouter();
  const isEditing = !!snippet;

  const [title, setTitle] = useState(snippet?.title ?? '');
  const [code, setCode] = useState(snippet?.code ?? '');
  const [language, setLanguage] = useState(snippet?.language ?? 'javascript');
  const [description, setDescription] = useState(snippet?.description ?? '');
  const [tags, setTags] = useState<string[]>(snippet?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(snippet?.is_public ?? false);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  function addTag(value: string) {
    const tag = value.replace(/^#/, '').trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title || !code || !language) {
      toast.error('Title, code, and language are required.');
      return;
    }

    setLoading(true);
    try {
      const body = { title, code, language, description, tags, is_public: isPublic };
      const url = isEditing ? `/api/snippets/${snippet.id}` : '/api/snippets';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to save snippet');
      }

      toast.success(isEditing ? 'Snippet updated!' : 'Snippet created!');
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">

        {/* Left column — metadata */}
        <div className="space-y-4">

          {/* Details card */}
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50 bg-linear-to-r from-primary/5 to-violet-500/5">
              <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold">Details</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Title <span className="text-destructive normal-case tracking-normal">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="My awesome snippet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="language" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Language <span className="text-destructive normal-case tracking-normal">*</span>
                </Label>
                <Select value={language} onValueChange={(v) => { if (v !== null) setLanguage(v); }}>
                  <SelectTrigger id="language" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="What does this snippet do?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none text-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Tags card */}
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50 bg-linear-to-r from-violet-500/5 to-primary/5">
              <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-violet-500/10">
                <Tag className="h-3.5 w-3.5 text-violet-500" />
              </div>
              <span className="text-sm font-semibold">Tags</span>
              {tags.length > 0 && (
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {tags.length}
                </span>
              )}
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="react, hooks, api…"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="h-9 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => addTag(tagInput)} className="h-9 shrink-0">
                  Add
                </Button>
              </div>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Press Enter or comma to add tags</p>
              )}
            </div>
          </div>

          {/* Visibility card */}
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50 bg-linear-to-r from-emerald-500/5 to-primary/5">
              <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-emerald-500/10">
                {isPublic ? <Globe className="h-3.5 w-3.5 text-emerald-500" /> : <Lock className="h-3.5 w-3.5 text-emerald-500" />}
              </div>
              <span className="text-sm font-semibold">Visibility</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium">{isPublic ? 'Public' : 'Private'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isPublic ? 'Anyone with the link can view' : 'Only you can see this'}
                </p>
              </div>
              <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1 shadow-lg shadow-primary/20 font-semibold">
              {loading ? 'Saving…' : isEditing ? 'Update Snippet' : 'Save Snippet'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Right column — code editor */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50 bg-[#181825]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex items-center gap-1.5 ml-1">
                <Code2 className="h-3.5 w-3.5 text-[#cdd6f4]/50" />
                <Label htmlFor="code" className="text-xs font-medium text-[#cdd6f4]/60 cursor-pointer">
                  Code <span className="text-[#f38ba8]">*</span>
                </Label>
                {language && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono font-semibold">
                    {language}
                  </span>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1.5 text-[#cdd6f4]/60 hover:text-[#cdd6f4] hover:bg-white/5"
              onClick={() => setPreviewOpen(true)}
              disabled={!code.trim()}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>
          </div>
          <Textarea
            id="code"
            placeholder="// Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-140 resize-y border-0 rounded-none focus-visible:ring-0 bg-[#1e1e2e] text-[#cdd6f4] placeholder:text-white/15 leading-relaxed"
            required
          />
          {code && (
            <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-t border-white/5 text-[10px] text-[#cdd6f4]/30 font-mono">
              <span>{code.split('\n').length} lines</span>
              <span>{code.length} chars</span>
            </div>
          )}
        </div>
      </div>
    </form>

    <CodePreviewModal
      open={previewOpen}
      onOpenChange={setPreviewOpen}
      code={code}
      language={language}
    />
    </>
  );
}
