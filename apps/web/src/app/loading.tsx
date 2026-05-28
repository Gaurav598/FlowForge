export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-background">
      <div className="glass flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted-foreground">
        <span className="size-2 animate-pulse rounded-full bg-primary" />
        Loading FlowForge
      </div>
    </main>
  );
}
