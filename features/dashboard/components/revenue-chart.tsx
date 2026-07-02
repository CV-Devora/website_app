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
    <Card>
      <CardHeader>
        <CardTitle>Revenue Penjualan</CardTitle>
        <CardDescription>Grafik total penjualan harian</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.55 0.2 255)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.55 0.2 255)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 240)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "oklch(0.55 0.03 240)" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "oklch(0.55 0.03 240)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatRupiah}
              width={72}
            />
            <Tooltip
              formatter={(v: number) => [formatRupiah(v), "Revenue"]}
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
      </CardContent>
    </Card>
  );
}
