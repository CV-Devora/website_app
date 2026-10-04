import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { SiInstagram, SiFacebook, SiWhatsapp } from "@icons-pack/react-simple-icons";

const columns = [
  {
    title: "Navigasi",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Produk", href: "/produk" },
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Layanan", href: "/layanan" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Hubungi Kami", href: "/kontak" },
      { label: "Cara Pemesanan", href: "#" },
      { label: "Kebijakan Toko", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
];

export function FooterFull() {
  return (
    <footer className="relative border-t border-gold/10 bg-foreground overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground to-foreground/95" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-12 border-b border-background/10">
          {/* Brand column */}
          <div>
            <p className="text-xl text-background font-semibold mb-1">
              <span className="italic text-gold">Jason</span>{" "}
              <span className="font-light">Jewelry</span>
            </p>
            <p className="text-sm text-background/40 mb-6 leading-relaxed max-w-xs">
              Perhiasan emas dengan kemurnian terjamin, dibuat untuk dikenang lintas generasi. Melayani dengan hati sejak 2012.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-2.5 mb-6">
              <a href="mailto:hello@jasonjewelry.id" className="flex items-center gap-2.5 text-sm text-background/50 hover:text-gold transition-colors duration-200">
                <Mail className="size-3.5 shrink-0" />
                hello@jasonjewelry.id
              </a>
              <p className="flex items-start gap-2.5 text-sm text-background/50">
                <MapPin className="size-3.5 shrink-0 mt-0.5" />
                Pasar Minggu, Jakarta Selatan 12510
              </p>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {[
                { icon: <SiInstagram size={15} />, href: "https://www.instagram.com/emasjason/", label: "Instagram" },
                { icon: <SiWhatsapp size={15} />, href: "https://wa.me/+62 821-1253-8703", label: "WhatsApp" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-background/10 text-background/40 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col items-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold/40 mb-5">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5 items-center">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/50 hover:text-gold transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
          <p className="font-mono text-[11px] text-background/25">
            © {new Date().getFullYear()} Jason Jewelry. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}