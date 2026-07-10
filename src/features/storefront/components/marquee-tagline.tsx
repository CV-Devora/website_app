const taglines = [
  "KEMURNIAN TERJAMIN",
  "TERA RESMI",
  "DESAIN ATEMPORAL",
  "WARISAN GENERASI",
];

export function MarqueeTagline() {
  const items = [...taglines, ...taglines];

  return (
    <div className="bg-emerald py-4 overflow-hidden">
      <div className="flex w-max animate-marquee">
        {items.map((text, i) => (
          <span
            key={i}
            className="flex items-center px-8 text-sm font-medium uppercase tracking-widest text-white whitespace-nowrap"
          >
            {text}
            <span className="ml-8 text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}