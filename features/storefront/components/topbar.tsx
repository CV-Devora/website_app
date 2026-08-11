import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { SiInstagram } from "@icons-pack/react-simple-icons";

export function Topbar() {
  return (
    <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-white">
      <div className="mx-auto max-w-6xl px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-5">
          <a href="tel:+628123456789" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Phone className="size-3" />
            <span className="hidden sm:inline">+62 812-3456-789</span>
          </a>
          <a
            href="mailto:hello@jasonjewelry.id"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <Mail className="size-3" />
            <span className="hidden sm:inline">hello@jasonjewelry.id</span>
          </a>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <SiInstagram size={12} />
          <span className="hidden sm:inline">@jasonjewelry.id</span>
        </a>
      </div>
    </div>
  );
}