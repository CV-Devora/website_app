const partners = ["Antam", "UBS Gold", "Antam", "UBS Gold", "Antam", "UBS Gold", "Antam", "UBS Gold", "Antam"];

export function Partners() {
  return (
    <section
      className="py-16"
      style={{
        background: "linear-gradient(180deg, var(--rose-start), var(--rose-end))",
      }}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-olive">
          My Mitra
        </h2>
        <p className="text-sm text-white/90 max-w-md mx-auto mt-3">
          Jason Jewelry bekerja sama dengan mitra terpercaya untuk menjamin
          kemurnian dan kualitas setiap produk yang kami hadirkan.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
          {partners.map((name, i) => (
            <div
              key={i}
              className={`flex items-center justify-center gap-2 rounded-lg bg-white/95 py-6 shadow-sm ${
                i === 1 ? "ring-2 ring-rose-end" : ""
              }`}
            >
              {/* Placeholder — ganti dengan logo resmi partner di /public/partners/ */}
              <span className="flex size-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-navy-foreground">
                {name.charAt(0)}
              </span>
              <span className="text-sm font-medium text-navy">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}