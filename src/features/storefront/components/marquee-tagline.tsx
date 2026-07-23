const taglines = ["GOLD JEWELRY", "KEMURNIAN TERJAMIN", "TERA RESMI", "SEJAK 12 TAHUN"];

export function MarqueeTagline() {
  const items = [...taglines, ...taglines];

  return (
    <div className="bg-olive py-3 overflow-hidden">
      <div className="flex w-max animate-marquee">
        {items.map((text, i) => (
          <span
            key={i}
            className="flex items-center px-8 text-sm font-medium uppercase tracking-widest text-olive-foreground whitespace-nowrap"
          >
            {text}
            <span className="ml-8 text-olive-foreground/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}