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
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-background to-violet-500/5 pointer-events-none" />
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-linear-to-br from-primary to-violet-600 shadow-lg shadow-primary/25 shrink-0">
              <Plus className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">New Snippet</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Add a code snippet to your library</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <CreateSnippetForm />
      </main>
    </div>
  );
}
