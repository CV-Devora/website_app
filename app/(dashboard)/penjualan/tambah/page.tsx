"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowLeft, Search } from "lucide-react";

interface User {
  id: string;
  nama: string;
  role: string;
}

interface Barang {
  id: string;
  barcode: string;
  nama: string;
  karat?: { id: string; name: string };
  berat: number;
  harga: number;
  kondisi: string;
}

export default function TambahPenjualanPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    no_faktur: "",
    nama: "",
    kode_sales: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(raw) as User;
        setCurrentUser(user);
        setFormData((prev) => ({ ...prev, kode_sales: user.id }));
      } catch {}
    }
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      const resBarang = await api.barang.list();
      setBarangList(resBarang.data as Barang[]);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  const toggleBarang = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const totalHarga = barangList
    .filter((b) => selectedIds.has(b.id))
    .reduce((sum, b) => sum + b.harga, 0);

  const filteredBarang = barangList.filter((b) =>
    b.nama.toLowerCase().includes(search.toLowerCase()) ||
    b.barcode.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!formData.no_faktur || !formData.nama || !formData.kode_sales) return;
    if (selectedIds.size === 0) {
      alert("Pilih minimal satu barang.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        no_faktur: formData.no_faktur,
        nama: formData.nama,
        total_harga: totalHarga,
        kode_sales: formData.kode_sales,
        barang_ids: Array.from(selectedIds),
      };

      await api.penjualan.create(payload);
      router.push("/penjualan");
    } catch (error) {
      console.error("Gagal menyimpan penjualan:", error);
      alert("Gagal menyimpan penjualan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex">
          <Button variant="ghost" size="icon" onClick={() => router.push("/penjualan")}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tambah Penjualan
            </h1>
            <p className="text-sm text-muted-foreground">
              Pilih barang yang akan dijual dan lengkapi data penjualan.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/penjualan")}>
            Batal
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Simpan Penjualan
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Penjualan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="no_faktur">Nomor Faktur</Label>
              <Input
                id="no_faktur"
                value={formData.no_faktur}
                onChange={(e) => setFormData({ ...formData, no_faktur: e.target.value })}
                placeholder="Contoh: SELL-2024-001"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="nama">Nama Pelanggan</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Pelanggan A"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Jumlah Harga</Label>
              <div className="flex h-8 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm font-semibold">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalHarga)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pilih Barang</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Cari barang..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Barcode</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kadar</TableHead>
                    <TableHead>Berat (gr)</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Kondisi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBarang.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Tidak ada barang tersedia.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBarang.map((b) => (
                      <TableRow
                        key={b.id}
                        className="cursor-pointer"
                        onClick={() => toggleBarang(b.id)}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(b.id)}
                            onChange={() => toggleBarang(b.id)}
                            className="size-4"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-xs">{b.barcode}</TableCell>
                        <TableCell className="font-medium">{b.nama}</TableCell>
                        <TableCell>{b.karat?.name ?? "-"}</TableCell>
                        <TableCell>{b.berat}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("id-batID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(b.harga)}
                        </TableCell>
                        <TableCell className="capitalize">{b.kondisi}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {selectedIds.size} barang dipilih
              </span>
              <span className="font-semibold">
                Total: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalHarga)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
