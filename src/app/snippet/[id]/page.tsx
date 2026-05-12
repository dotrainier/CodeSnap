import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { CodeHighlighter } from '@/components/CodeHighlighter';
import { SnippetActions } from '@/components/SnippetActions';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">

        {/* Back nav */}
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-5 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground')}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to library
        </Link>

        {/* Header card */}
        <div className="relative rounded-xl border border-border/60 bg-card overflow-hidden mb-5">
          <div className="h-1 w-full bg-linear-to-r from-violet-500 via-indigo-500 to-violet-500" />
          <div className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold tracking-tight">{snippet.title}</h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', getLangColor(snippet.language))}>
                    {snippet.language}
                  </span>
                  {snippet.is_public && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-600 border border-emerald-400/30 font-medium">
                      Public
                    </span>
                  )}
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
              <SnippetActions snippet={snippet} openExport={openExport === '1'} />
            </div>

            {snippet.description && (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{snippet.description}</p>
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

        {/* Code block */}
        <div className="rounded-xl overflow-hidden border border-border/60 shadow-lg shadow-black/5">
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1e1e2e] border-b border-white/5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-white/30 font-mono">{snippet.title}</span>
          </div>
          <CodeHighlighter code={snippet.code} language={snippet.language} theme="dracula" />
        </div>
      </main>
    </div>
  );
}
