export function QuoteBanner() {
  return (
    <section className="relative bg-foreground py-32 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-radial-gradient" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.72 0.14 75 / 0.05) 0%, transparent 70%)"
      }} />

      {/* Decorative elements */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-gold/10" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t border-r border-gold/10" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b border-l border-gold/10" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-gold/10" />

      {/* Horizontal divider lines */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-gold/20 to-transparent" />
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-t from-gold/20 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Opening quote mark */}
        <div className="flex justify-center mb-6">
          <span className="text-7xl text-gold/25 font-serif leading-none select-none">&ldquo;</span>
        </div>

        <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-background leading-relaxed">
          Emas bukan hanya perhiasan — ia adalah{" "}
          <span className="italic text-shimmer-gold">warisan</span>{" "}
          yang dijaga dari satu generasi ke generasi berikutnya.
        </p>

        {/* Closing */}
        <div className="flex justify-center mt-10">
          <span className="text-7xl text-gold/25 font-serif leading-none select-none">&rdquo;</span>
        </div>

        <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent mt-4" />
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-gold/40 mt-5">
          — Jason Jewelry, Toba Sumatera Utara
        </p>
      </div>
    </section>
  );
}