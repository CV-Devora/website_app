"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Gem, ArrowRight } from "lucide-react";

const menuCards = [
  {
    href: "/settings/barang-landing",
    title: "Katalog Barang",
    description:
      "Kelola daftar barang yang akan ditampilkan di katalog.",
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full min-w-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Pengaturan
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Pilih menu pengaturan yang ingin dikelola.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menuCards.map((menu) => (
          <Link key={menu.href} href={menu.href} className="group">
            <Card className="h-full transition-all duration-150 hover:border-gold/40 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  {menu.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{menu.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
