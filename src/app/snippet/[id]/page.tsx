import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { CodeHighlighter } from '@/components/CodeHighlighter';
import { SnippetActions } from '@/components/SnippetActions';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft, Calendar, Eye, Hash, Globe, AlignLeft, Type, Clock } from 'lucide-react';

const LANG_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 border-yellow-400/30',
  typescript: 'bg-blue-400/15 text-blue-600 dark:text-blue-400 border-blue-400/30',
  python: 'bg-green-400/15 text-green-600 dark:text-green-400 border-green-400/30',
  rust: 'bg-orange-400/15 text-orange-600 dark:text-orange-400 border-orange-400/30',
  go: 'bg-cyan-400/15 text-cyan-600 dark:text-cyan-400 border-cyan-400/30',
  css: 'bg-pink-400/15 text-pink-600 dark:text-pink-400 border-pink-400/30',
  html: 'bg-red-400/15 text-red-600 dark:text-red-400 border-red-400/30',
  sql: 'bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 border-indigo-400/30',
  bash: 'bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 border-emerald-400/30',
  java: 'bg-amber-400/15 text-amber-700 dark:text-amber-400 border-amber-400/30',
  php: 'bg-violet-400/15 text-violet-600 dark:text-violet-400 border-violet-400/30',
  ruby: 'bg-rose-400/15 text-rose-600 dark:text-rose-400 border-rose-400/30',
};

function getLangColor(lang: string) {
  return LANG_COLORS[lang.toLowerCase()] ?? 'bg-primary/10 text-primary border-primary/20';
}

export default async function SnippetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ export?: string }>;
}) {
  const { id } = await params;
  const { export: openExport } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: snippet } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!snippet) notFound();

  const lineCount = snippet.code.split('\n').length;
  const charCount = snippet.code.length;
  const wordCount = snippet.code.split(/\s+/).filter(Boolean).length;
  const readTimeSec = Math.max(1, Math.round((lineCount / 200) * 60));
  const readTimeLabel = readTimeSec < 60
    ? `${readTimeSec}s`
    : `${Math.round(readTimeSec / 60)}m ${readTimeSec % 60}s`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 max-w-6xl">
        {/* Breadcrumb */}
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-2 mb-4 gap-1.5 text-muted-foreground hover:text-foreground')}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to library
        </Link>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-5 items-start">

          {/* LEFT: Code viewer + Insights */}
          <div className="flex flex-col gap-5 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden border border-border shadow-xl shadow-black/5 dark:shadow-black/20">
              <div className="flex items-center justify-between px-4 py-3 bg-[#11111b] border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-[11px] text-white/35 font-mono">{snippet.title}.{snippet.language}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-md font-mono font-bold border', getLangColor(snippet.language))}>
                    {snippet.language}
                  </span>
                  <span className="text-[10px] text-white/20 font-mono">{lineCount} ln</span>
                </div>
              </div>
              <CodeHighlighter code={snippet.code} language={snippet.language} theme="dracula" />
              <div className="flex items-center justify-between px-4 py-1.5 bg-[#11111b] border-t border-white/5 text-[10px] font-mono text-white/20">
                <span>UTF-8</span>
                <span>{lineCount} lines · {charCount} chars</span>
              </div>
            </div>

            {/* Code Insights */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Code Insights</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border/40 min-w-0">
                <div className="flex flex-col items-center gap-1 px-4 py-4">
                  <AlignLeft className="h-4 w-4 text-muted-foreground mb-0.5" />
                  <span className="text-xl font-bold tabular-nums">{lineCount}</span>
                  <span className="text-[11px] text-muted-foreground">Lines</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4 py-4">
                  <Type className="h-4 w-4 text-muted-foreground mb-0.5" />
                  <span className="text-xl font-bold tabular-nums">{wordCount.toLocaleString()}</span>
                  <span className="text-[11px] text-muted-foreground">Tokens</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4 py-4">
                  <Clock className="h-4 w-4 text-muted-foreground mb-0.5" />
                  <span className="text-xl font-bold tabular-nums">{readTimeLabel}</span>
                  <span className="text-[11px] text-muted-foreground">Read time</span>
                </div>
              </div>
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                    <span>Lines</span>
                    <span className="font-medium text-foreground">{lineCount} / 500</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min((lineCount / 500) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                    <span>Size</span>
                    <span className="font-medium text-foreground">{charCount.toLocaleString()} chars</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${Math.min((charCount / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Metadata sidebar */}
          <div className="space-y-4 order-1 lg:order-2">

            {/* Title + actions card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="h-0.5 w-full bg-linear-to-r from-primary via-violet-500 to-indigo-500" />
              <div className="p-5">
                <h1 className="text-lg font-bold tracking-tight leading-snug mb-4">{snippet.title}</h1>
                <SnippetActions snippet={snippet} openExport={openExport === '1'} />
              </div>
            </div>

            {/* Details card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</span>
              </div>
              <div className="divide-y divide-border/40">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">Language</span>
                  <span className={cn('text-xs px-2.5 py-0.5 rounded-full border font-semibold', getLangColor(snippet.language))}>
                    {snippet.language}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Globe className="h-3 w-3" /> Visibility
                  </span>
                  <span className={cn(
                    'text-xs px-2.5 py-0.5 rounded-full border font-medium',
                    snippet.is_public
                      ? 'bg-emerald-400/15 text-emerald-600 dark:text-emerald-400 border-emerald-400/30'
                      : 'bg-muted text-muted-foreground border-border/50'
                  )}>
                    {snippet.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Created
                  </span>
                  <span className="text-xs font-medium">
                    {new Date(snippet.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Hash className="h-3 w-3" /> Lines
                  </span>
                  <span className="text-xs font-semibold tabular-nums">{lineCount}</span>
                </div>
                {snippet.view_count > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Eye className="h-3 w-3" /> Views
                    </span>
                    <span className="text-xs font-semibold tabular-nums">{snippet.view_count}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description card */}
            {snippet.description && (
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</span>
                </div>
                <p className="px-4 py-4 text-sm text-muted-foreground leading-relaxed">{snippet.description}</p>
              </div>
            )}

            {/* Tags card */}
            {snippet.tags?.length > 0 && (
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</span>
                </div>
                <div className="px-4 py-4 flex flex-wrap gap-1.5">
                  {snippet.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
