"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Topbar } from "@/features/storefront/components/topbar";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { Hero } from "@/features/storefront/components/hero";
import { JourneyStats } from "@/features/storefront/components/journey-stats";
import { MarqueeTagline } from "@/features/storefront/components/marquee-tagline";
import { CampaignBanner } from "@/features/storefront/components/campaign-banner";
import { CollectionGrid } from "@/features/storefront/components/collection-grid";
import { QuoteBanner } from "@/features/storefront/components/quote-banner";
import { StoreLocations } from "@/features/storefront/components/store-locations";
import { Newsletter } from "@/features/storefront/components/newsletter";
import { FooterFull } from "@/features/storefront/components/footer-full";
import type { BarangCardData } from "@/features/storefront/components/product-card";

export default function LandingPage() {
  const [featured, setFeatured] = useState<BarangCardData[]>([]);

  useEffect(() => {
    api.barang
      .list()
      .then((res) => setFeatured((res.data as BarangCardData[]).slice(0, 4)))
      .catch((err) => console.error("Failed to fetch featured barang:", err));
  }, []);

  return (
    <div className="theme-storefront min-h-screen bg-background text-foreground flex flex-col">
      <Topbar />
      <StorefrontHeader />
      <Hero />
      <JourneyStats />
      <MarqueeTagline />
      <CampaignBanner />
      <CollectionGrid items={featured} />
      <QuoteBanner />
      <StoreLocations />
      <Newsletter />
      <FooterFull />
    </div>
  );
}