export function QuoteBanner() {
  return (
    <section className="relative bg-foreground py-28 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t border-l border-gold/15" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r border-gold/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="text-gold text-6xl leading-none font-serif">&ldquo;</span>
        <p className="text-2xl sm:text-3xl font-semibold text-background leading-snug mt-3">
          Emas bukan hanya perhiasan — ia adalah{" "}
          <span className="italic text-gold-light">warisan</span> yang dijaga dari satu
          generasi ke generasi berikutnya.
        </p>
        <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent mt-8" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/50 mt-4">
          Jason Jewelry
        </p>
      </div>
    </section>
  );
}