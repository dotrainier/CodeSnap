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

  async function handleGitHubAuth() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      // browser navigates to GitHub — no need to reset loading
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
      setLoading(false);
    }
  }

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
              '11 syntax themes with Shiki',
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

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGitHubAuth}
            disabled={loading}
          >
            <svg className="h-4 w-4 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
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
