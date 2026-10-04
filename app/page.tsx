"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { Hero } from "@/features/storefront/components/hero";
import { JourneyStats } from "@/features/storefront/components/journey-stats";
import { MarqueeTagline } from "@/features/storefront/components/marquee-tagline";
import { CollectionGrid } from "@/features/storefront/components/collection-grid";
import { StoreLocations } from "@/features/storefront/components/store-locations";
import { FooterFull } from "@/features/storefront/components/footer-full";
import type { BarangCardData } from "@/features/storefront/components/product-card";

export default function LandingPage() {
  const [featured, setFeatured] = useState<BarangCardData[]>([]);

  useEffect(() => {
    api.barangLanding
      .list()
      .then((res) => setFeatured(res.data as BarangCardData[]))
      .catch((err) => console.error("Failed to fetch featured barang:", err));
  }, []);

  return (
    <div className="theme-storefront min-h-screen bg-background text-foreground flex flex-col">
      <StorefrontHeader />
      <Hero />
      <JourneyStats />
      <MarqueeTagline />
      <CollectionGrid items={featured} />
      <StoreLocations />
      <FooterFull />
    </div>
  );
}