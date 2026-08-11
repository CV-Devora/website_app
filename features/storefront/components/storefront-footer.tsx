export function StorefrontFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-lg italic text-foreground">Jason Jewelry</p>
          <p className="text-sm text-muted-foreground mt-1">
            Perhiasan emas dengan kemurnian terjamin.
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} Jason Jewelry
        </p>
      </div>
    </footer>
  );
}