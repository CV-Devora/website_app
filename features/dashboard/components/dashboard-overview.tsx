"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatsCards } from "./stats-cards";
import { RevenueChart } from "./revenue-chart";
import { RecentTransactions } from "./recent-transactions";
import { GoldDistribution } from "./gold-distribution";

interface DashboardData {
  barang_chart: { label: string; value: number }[];
  penjualan_chart: { label: string; value: number }[];
  pembelian_chart: { label: string; value: number }[];
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard
      .get()
      .then((res) => setData(res.data as DashboardData))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan performa toko emas Anda hari ini.
        </p>
      </div>

      {/* Stats cards */}
      <StatsCards data={data} loading={loading} />

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart
            data={data?.penjualan_chart ?? []}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-3">
          <GoldDistribution
            data={data?.barang_chart ?? []}
            loading={loading}
          />
        </div>
      </div>

      {/* Recent transactions */}
      <RecentTransactions
        penjualan={data?.penjualan_chart ?? []}
        pembelian={data?.pembelian_chart ?? []}
        loading={loading}
      />
    </div>
  );
}
