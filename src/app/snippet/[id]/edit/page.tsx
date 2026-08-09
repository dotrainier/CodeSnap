import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { CreateSnippetForm } from '@/components/CreateSnippetForm';

export default async function EditSnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: snippet } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!snippet) notFound();

  return (
    <div className='min-h-screen bg-background'>
      <Navbar user={user} />

      <div className='relative overflow-hidden border-b border-border/50'>
        <div className='absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none' />
        <div className='absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none' />
        <div className='container mx-auto px-4 py-6 relative'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center h-9 w-9 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25'>
              <svg
                className='h-5 w-5 text-white'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
              </svg>
            </div>
            <div>
              <h1 className='text-xl font-bold tracking-tight'>Edit Snippet</h1>
              <p className='text-xs text-muted-foreground mt-0.5 truncate max-w-xs'>
                {snippet.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className='container mx-auto px-4 py-8 max-w-4xl'>
        <CreateSnippetForm snippet={snippet} />
      </main>
    </div>
  );
}
