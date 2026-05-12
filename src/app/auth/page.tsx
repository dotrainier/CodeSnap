'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleEmailAuth(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/';
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Check your email to confirm your account.');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-linear-to-br from-violet-600 via-indigo-600 to-violet-800 p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 right-8 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/20 backdrop-blur">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">CodeSnap</span>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-white/90 text-2xl font-medium leading-snug">
            &ldquo;Save, highlight, and share your code with beautiful visuals.&rdquo;
          </blockquote>
          <div className="space-y-3">
            {[
              '50+ syntax themes with Shiki',
              'Export as stunning PNG images',
              'Public sharing with a single link',
              'Tag-based organization & search',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-white/80 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-white/60 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs relative z-10">
          Built with Next.js · Supabase · Shiki
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg bg-linear-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
            CodeSnap
          </span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'signin'
                ? 'Sign in to your snippet library'
                : 'Start building your snippet library'}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              className="font-medium text-primary hover:underline underline-offset-4"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
