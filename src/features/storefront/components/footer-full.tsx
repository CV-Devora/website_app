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
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14 grid sm:grid-cols-[1.3fr_1fr_1fr] gap-10">
        <div>
          <p className="text-xl italic text-foreground">Jason Jewelry</p>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            Perhiasan emas dengan kemurnian terjamin, dibuat untuk dikenang lintas generasi.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-emerald hover:border-emerald transition-colors"
            >
              <SiInstagram size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-emerald hover:border-emerald transition-colors"
            >
              <SiFacebook size={16} />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {col.title}
            </p>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 hover:text-emerald transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="sm:col-span-3 sm:hidden flex flex-col gap-2 text-sm text-muted-foreground">
          <a href="tel:+628123456789" className="flex items-center gap-2">
            <Phone className="size-4" /> +62 812-3456-789
          </a>
          <a href="mailto:hello@jasonjewelry.id" className="flex items-center gap-2">
            <Mail className="size-4" /> hello@jasonjewelry.id
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Jason Jewelry. Seluruh hak cipta dilindungi.
          </p>
          <p className="font-mono text-xs text-muted-foreground">Dibuat dengan ketelitian di Toba, Sumatera Utara</p>
        </div>
      </div>
    </footer>
  );
}