"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { Hero } from "@/features/storefront/components/hero";
import { Journey } from "@/features/storefront/components/journey";
import { MarqueeTagline } from "@/features/storefront/components/marquee-tagline";
import { CollectionGrid } from "@/features/storefront/components/collection-grid";
import { Partners } from "@/features/storefront/components/partners";
import { FooterFull } from "@/features/storefront/components/footer-full";
import type { BarangCardData } from "@/features/storefront/components/product-card";

export default function LandingPage() {
  const [items, setItems] = useState<BarangCardData[]>([]);

  useEffect(() => {
    api.barang
      .list()
      .then((res) => setItems(res.data as BarangCardData[]))
      .catch((err) => console.error("Failed to fetch barang:", err));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />
      <Hero />
      <Journey />
      <MarqueeTagline />
      <CollectionGrid items={items} />
      <MarqueeTagline />
      <Partners />
      <FooterFull />
    </div>
  );
}