import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { SiInstagram } from "@icons-pack/react-simple-icons";

export function Topbar() {
  return (
    <div className="bg-foreground text-background/70">
      <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-5">
          <a
            href="tel:+628123456789"
            className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200"
          >
            <Phone className="size-3" />
            <span className="hidden sm:inline">+62 812-3456-789</span>
          </a>
          <a
            href="mailto:hello@jasonjewelry.id"
            className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200"
          >
            <Mail className="size-3" />
            <span className="hidden sm:inline">hello@jasonjewelry.id</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono text-[10px] tracking-wider text-background/40 uppercase">
            Senin–Sabtu · 08.00–17.00
          </span>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200"
          >
            <SiInstagram size={11} />
            <span className="hidden sm:inline">@jasonjewelry.id</span>
          </a>
        </div>
      </div>
    </div>
  );
}