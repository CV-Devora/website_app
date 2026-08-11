import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { SiInstagram, SiFacebook } from "@icons-pack/react-simple-icons";

const columns = [
  {
    title: "Navigasi",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Produk", href: "/produk" },
      { label: "Masuk", href: "/login" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Hubungi Kami", href: "#" },
      { label: "Cara Pemesanan", href: "#" },
      { label: "Kebijakan Toko", href: "#" },
    ],
  },
];

export function FooterFull() {
  return (
    <footer className="border-t border-gold/10 bg-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16 grid sm:grid-cols-[1.3fr_1fr_1fr] gap-10">
        <div>
          <p className="text-xl text-background">
            <span className="italic">Jason</span>{" "}
            <span className="font-light">Jewelry</span>
          </p>
          <p className="text-sm text-background/50 mt-3 max-w-xs leading-relaxed">
            Perhiasan emas dengan kemurnian terjamin, dibuat untuk dikenang lintas generasi.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-full border border-background/15 text-background/50 hover:text-gold hover:border-gold/40 transition-all duration-200"
            >
              <SiInstagram size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-9 items-center justify-center rounded-full border border-background/15 text-background/50 hover:text-gold hover:border-gold/40 transition-all duration-200"
            >
              <SiFacebook size={16} />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold/50 mb-5">
              {col.title}
            </p>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="sm:col-span-3 sm:hidden flex flex-col gap-2 text-sm text-background/50">
          <a href="tel:+628123456789" className="flex items-center gap-2">
            <Phone className="size-4" /> +62 812-3456-789
          </a>
          <a href="mailto:hello@jasonjewelry.id" className="flex items-center gap-2">
            <Mail className="size-4" /> hello@jasonjewelry.id
          </a>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-background/35">
            © {new Date().getFullYear()} Jason Jewelry. Seluruh hak cipta dilindungi.
          </p>
          <p className="font-mono text-xs text-background/35">
            Dibuat dengan ketelitian di Toba, Sumatera Utara
          </p>
        </div>
      </div>
    </footer>
  );
}