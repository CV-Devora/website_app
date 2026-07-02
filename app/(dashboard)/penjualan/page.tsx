"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

interface Penjualan {
  id: string;
  no_faktur: string;
  nama: string;
  total_harga: number;
  kode_sales: string;
}

interface User {
  id: string;
  nama: string;
  role: string;
}

export default function PenjualanPage() {
  const [penjualans, setPenjualans] = useState<Penjualan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    no_faktur: "",
    nama: "",
    total_harga: "",
    kode_sales: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resPenjualan, resUsers] = await Promise.all([
        api.penjualan.list(),
        api.users.list(),
      ]);
      setPenjualans(resPenjualan.data as Penjualan[]);
      setUsers(resUsers.data as User[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSheet = (penjualan?: Penjualan) => {
    if (penjualan) {
      setEditingId(penjualan.id);
      setFormData({
        no_faktur: penjualan.no_faktur,
        nama: penjualan.nama,
        total_harga: penjualan.total_harga.toString(),
        kode_sales: penjualan.kode_sales,
      });
    } else {
      setEditingId(null);
      setFormData({
        no_faktur: "",
        nama: "",
        total_harga: "",
        kode_sales: "",
      });
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.no_faktur || !formData.nama || !formData.total_harga || !formData.kode_sales) return;
    
    setSubmitting(true);
    try {
      const payload = {
        no_faktur: formData.no_faktur,
        nama: formData.nama,
        total_harga: parseInt(formData.total_harga.replace(/\D/g, ""), 10),
        kode_sales: formData.kode_sales,
      };

      if (editingId) {
        await api.penjualan.update(editingId, payload);
      } else {
        await api.penjualan.create(payload);
      }
      
      const res = await api.penjualan.list();
      setPenjualans(res.data as Penjualan[]);
      
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save penjualan:", error);
      alert("Gagal menyimpan penjualan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data penjualan ini?")) return;
    try {
      await api.penjualan.delete(id);
      const res = await api.penjualan.list();
      setPenjualans(res.data as Penjualan[]);
    } catch (error) {
      console.error("Failed to delete penjualan:", error);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const getSalesName = (kodeSales: string) => {
    const user = users.find((u) => u.id === kodeSales);
    return user ? user.nama : kodeSales;
  };

  const salesUsers = users.filter((u) => u.role === "sales");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Data Penjualan
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola transaksi penjualan ke pelanggan.
          </p>
        </div>
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="mr-2 size-4" />
          Tambah Penjualan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Penjualan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Faktur</TableHead>
                    <TableHead>Nama Pelanggan</TableHead>
                    <TableHead>Total Harga</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead className="w-[100px] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {penjualans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Tidak ada data penjualan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    penjualans.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.no_faktur}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell>{formatRupiah(item.total_harga)}</TableCell>
                        <TableCell>{getSalesName(item.kode_sales)}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenSheet(item)}
                            title="Edit"
                          >
                            <Pencil className="size-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            title="Hapus"
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col gap-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{editingId ? "Edit Penjualan" : "Tambah Penjualan"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Ubah data transaksi penjualan di bawah ini."
                : "Masukkan detail transaksi penjualan baru."}
            </SheetDescription>
          </SheetHeader>
          
          <form id="penjualan-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
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
              <Label htmlFor="total_harga">Total Harga (Rp)</Label>
              <Input
                id="total_harga"
                type="text"
                value={formData.total_harga}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, total_harga: val });
                }}
                placeholder="Contoh: 5000000"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="kode_sales">Pilih Sales</Label>
              <select
                id="kode_sales"
                value={formData.kode_sales}
                onChange={(e) => setFormData({ ...formData, kode_sales: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="" disabled>Pilih nama sales</option>
                {salesUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nama}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <SheetFooter className="px-6 py-4 border-t mt-auto">
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCloseSheet}>
                Batal
              </Button>
              <Button type="submit" form="penjualan-form" className="flex-1" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
