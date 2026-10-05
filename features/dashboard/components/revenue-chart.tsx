"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RevenueChartProps {
  data: { label: string; value: number }[];
  loading: boolean;
}

const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(v);

export function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Penjualan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data.length
    ? data.map((d) => ({ date: d.label, revenue: d.value }))
    : [
        { date: "Jan", revenue: 0 },
        { date: "Feb", revenue: 0 },
        { date: "Mar", revenue: 0 },
      ];

  return (
    <Card className="overflow-hidden min-w-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">Grafik Omzet Penjualan</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Perkembangan total nilai penjualan harian</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 px-2 sm:px-4">
        <div className="w-full h-[240px] sm:h-[270px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.2 255)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.2 255)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 240)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "oklch(0.55 0.03 240)" }}
                tickLine={false}
                axisLine={false}
                tickMargin={6}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.55 0.03 240)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatRupiah}
                width={56}
              />
              <Tooltip
                formatter={(v: any) => [formatRupiah(Number(v ?? 0)), "Omzet"]}
                contentStyle={{
                  background: "white",
                  border: "1px solid oklch(0.9 0.02 240)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.55 0.2 255)"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
