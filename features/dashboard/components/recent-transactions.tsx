"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ChartData {
  label: string;
  value: number;
}

interface RecentTransactionsProps {
  penjualan: ChartData[];
  pembelian: ChartData[];
  loading: boolean;
}

const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

export function RecentTransactions({
  penjualan,
  pembelian,
  loading,
}: RecentTransactionsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  // Merge and sort by date
  const merged = [
    ...penjualan.map((d) => ({ ...d, type: "penjualan" as const })),
    ...pembelian.map((d) => ({ ...d, type: "pembelian" as const })),
  ]
    .sort((a, b) => b.label.localeCompare(a.label))
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terkini</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {merged.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Belum ada data transaksi.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merged.map((row, i) => (
                <TableRow key={`${row.type}-${row.label}-${i}`}>
                  <TableCell className="font-medium text-sm">{row.label}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.type === "penjualan" ? "default" : "secondary"}
                      className={
                        row.type === "penjualan"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          : "bg-violet-100 text-violet-700 hover:bg-violet-100"
                      }
                    >
                      {row.type === "penjualan" ? "Penjualan" : "Pembelian"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRupiah(row.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
