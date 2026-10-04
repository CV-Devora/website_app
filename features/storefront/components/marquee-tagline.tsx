const taglines = [
  "KEMURNIAN TERJAMIN",
  "TERA RESMI",
  "DESAIN ATEMPORAL",
  "WARISAN GENERASI",
  "LAYANAN TERPERCAYA",
  "PERHIASAN PREMIUM",
];

export function MarqueeTagline() {
  const items = [...taglines, ...taglines, ...taglines, ...taglines];

  return (
    <div className="relative overflow-hidden border-y border-gold/20 py-4 bg-gradient-to-r from-gold-dark/5 via-background to-gold-dark/5">
      {/* Fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

      <div className="flex w-max animate-marquee">
        {items.map((text, i) => (
          <span
            key={i}
            className="flex items-center px-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/70 whitespace-nowrap"
          >
            {text}
            <span className="ml-10 text-gold/30">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}