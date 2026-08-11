const taglines = [
  "KEMURNIAN TERJAMIN",
  "TERA RESMI",
  "DESAIN ATEMPORAL",
  "WARISAN GENERASI",
];

export function MarqueeTagline() {
  const items = [...taglines, ...taglines, ...taglines];

  return (
    <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark py-4 overflow-hidden">
      <div className="flex w-max animate-marquee">
        {items.map((text, i) => (
          <span
            key={i}
            className="flex items-center px-10 text-sm font-medium uppercase tracking-[0.2em] text-white whitespace-nowrap"
          >
            {text}
            <span className="ml-10 text-white/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}