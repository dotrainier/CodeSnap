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
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-linear-to-br from-primary via-violet-600 to-indigo-700 p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-indigo-300/20 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-64 rounded-full bg-violet-300/10 blur-2xl pointer-events-none" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-white/15 backdrop-blur-sm">
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">CodeSnap</span>
        </div>

        <div className="relative space-y-8">
          <div>
            <p className="text-white/90 text-xl font-semibold leading-snug max-w-xs mb-6">
              Save, highlight, and share your code with beautiful visuals.
            </p>
            {/* Decorative code preview */}
            <div className="rounded-lg overflow-hidden border border-white/10 shadow-xl shadow-black/20">
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#181825]">
                <div className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
                <div className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
                <div className="h-2 w-2 rounded-full bg-[#28c840]/80" />
                <span className="ml-2 text-[10px] text-white/25 font-mono">greet.ts</span>
              </div>
              <pre className="text-xs font-mono leading-relaxed p-4 bg-[#1e1e2e] text-[#cdd6f4]/80 select-none">{`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

// ✓ Saved to CodeSnap`}</pre>
            </div>
          </div>
          <div className="space-y-3">
            {[
              '50+ syntax themes with Shiki',
              'Export as PNG images',
              'Public sharing with a single link',
              'Tag-based organization & search',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-white/75 text-sm">
                <div className="h-5 w-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/80" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/30 text-xs">
          Built with Next.js · Supabase · Shiki
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">CodeSnap</span>
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
            <Button type="submit" className="w-full" disabled={loading}>
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
