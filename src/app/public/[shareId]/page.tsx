import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { CodeHighlighter } from '@/components/CodeHighlighter';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Code2, Calendar, Eye } from 'lucide-react';

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

function getLangColor(lang: string) {
  return LANG_COLORS[lang.toLowerCase()] ?? 'bg-primary/10 text-primary border-primary/20';
}

export default async function PublicSnippetPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const supabase = await createClient();

  const { data: snippet } = await supabase
    .from('snippets')
    .select('*')
    .eq('share_id', shareId)
    .eq('is_public', true)
    .single();

  if (!snippet) notFound();

  supabase
    .from('snippets')
    .update({ view_count: (snippet.view_count ?? 0) + 1 })
    .eq('share_id', shareId)
    .then(() => {});

  return (
    <div className="min-h-screen bg-background">
      {/* Branded navbar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base bg-linear-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              CodeSnap
            </span>
          </Link>
          <Link href="/auth" className={cn(buttonVariants({ size: 'sm' }), 'shadow-lg shadow-primary/20')}>
            Sign in to save snippets
          </Link>
        </div>
      </header>

      {/* Page header decoration */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-5 relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight">{snippet.title}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', getLangColor(snippet.language))}>
                  {snippet.language}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-600 border border-emerald-400/30 font-medium">
                  Public
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(snippet.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {snippet.view_count > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {snippet.view_count} views
                  </span>
                )}
              </div>
            </div>
          </div>

          {snippet.description && (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl">{snippet.description}</p>
          )}

          {snippet.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {snippet.tags.map((tag: string) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="rounded-xl overflow-hidden border border-border/60 shadow-lg shadow-black/5">
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1e1e2e] border-b border-white/5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-white/30 font-mono">{snippet.title}</span>
          </div>
          <CodeHighlighter code={snippet.code} language={snippet.language} theme="dracula" />
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-xl border border-border/60 bg-linear-to-br from-violet-500/5 via-card to-indigo-500/5 p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-linear-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">CodeSnap</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Save, highlight, and share your code with beautiful visuals.</p>
          <Link href="/auth" className={cn(buttonVariants(), 'shadow-lg shadow-primary/20')}>
            Start for free
          </Link>
        </div>
      </main>
    </div>
  );
}
