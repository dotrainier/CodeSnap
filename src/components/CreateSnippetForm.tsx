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
import { X, Eye } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Card-style section: core fields */}
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-sm font-medium">Title <span className="text-destructive">*</span></Label>
          <Input
            id="title"
            placeholder="My awesome snippet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="language" className="text-sm font-medium">Language <span className="text-destructive">*</span></Label>
          <Select value={language} onValueChange={(v) => { if (v !== null) setLanguage(v); }}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            placeholder="What does this snippet do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* Code section */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <Label htmlFor="code" className="ml-2 text-xs font-medium text-muted-foreground">
              Code <span className="text-destructive">*</span>
            </Label>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => setPreviewOpen(true)}
            disabled={!code.trim()}
          >
            <Eye className="h-3 w-3" />
            Preview
          </Button>
        </div>
        <Textarea
          id="code"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono text-sm min-h-64 resize-y border-0 rounded-none focus-visible:ring-0 bg-[#1e1e2e] text-[#cdd6f4] placeholder:text-white/20"
          required
        />
      </div>

      {/* Tags section */}
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
        <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            placeholder="Press Enter to add: react, hooks, api…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
          />
          <Button type="button" variant="outline" onClick={() => addTag(tagInput)} className="shrink-0">
            Add
          </Button>
        </div>
        {tags.length > 0 && (
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
        )}
      </div>

      {/* Visibility toggle */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4">
        <div>
          <p className="text-sm font-medium">Make public</p>
          <p className="text-xs text-muted-foreground mt-0.5">Anyone with the link can view this snippet</p>
        </div>
        <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={loading} className="shadow-lg shadow-primary/20">
          {loading ? 'Saving…' : isEditing ? 'Update Snippet' : 'Save Snippet'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
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
