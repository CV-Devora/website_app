function round(n: number) {
  return Math.round(n * 100) / 100;
}

interface HallmarkStampProps {
  karat?: number;
  strokeColor?: string;
  textColor?: string;
  labelColor?: string;
}

export function HallmarkStamp({
  karat = 24,
  strokeColor = "var(--gold)",
  textColor = "var(--foreground)",
  labelColor = "var(--emerald)",
}: HallmarkStampProps) {
  const ticks = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * 2 * Math.PI;
    const x1 = round(100 + 88 * Math.cos(angle));
    const y1 = round(100 + 88 * Math.sin(angle));
    const x2 = round(100 + 96 * Math.cos(angle));
    const y2 = round(100 + 96 * Math.sin(angle));
    return (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="1.5" />
    );
  });

  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="80" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="3 5" />
      {ticks}
      <text x="100" y="98" textAnchor="middle" fontSize="34" fontWeight="700" fill={textColor}>
        {karat}K
      </text>
      <text x="100" y="122" textAnchor="middle" fontSize="11" letterSpacing="3" fill={labelColor}>
        MURNI
      </text>
    </svg>
  );
}