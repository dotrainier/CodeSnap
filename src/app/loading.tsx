export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/90">
        <div className="h-0.5 w-full bg-primary" />
        <div className="container mx-auto flex h-13 items-center justify-between px-4">
          <div className="h-7 w-28 rounded-lg bg-muted animate-pulse" />
          <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
        </div>
      </div>

      {/* Header skeleton */}
      <div className="border-b border-border px-4 py-8">
        <div className="container mx-auto max-w-7xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-5 w-36 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-44 rounded bg-muted animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-28 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-sm">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
          <div className="h-10 rounded-lg bg-muted animate-pulse max-w-sm" />
        </div>
      </div>

      {/* Grid skeleton */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="h-10 w-64 rounded-xl bg-muted animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="h-0.75 w-full bg-muted animate-pulse" />
              <div className="p-4 space-y-2.5">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
              <div className="mx-4 mb-3 h-36 rounded-lg bg-muted animate-pulse" />
              <div className="mt-auto px-3 pb-3 pt-2 border-t border-border/60 flex gap-1">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-7 w-16 rounded-md bg-muted animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
