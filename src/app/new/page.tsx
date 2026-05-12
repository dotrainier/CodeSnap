import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { CreateSnippetForm } from '@/components/CreateSnippetForm';
import { Plus } from 'lucide-react';

export default async function NewSnippetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Page header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">New Snippet</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Add a new code snippet to your library</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <CreateSnippetForm />
      </main>
    </div>
  );
}
