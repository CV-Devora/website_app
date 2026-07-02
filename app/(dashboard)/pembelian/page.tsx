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

interface Pembelian {
  id: string;
  no_faktur: string;
  nama: string;
  tipe_pemasok: string;
  harga_deal: number;
}

export default function PembelianPage() {
  const [pembelians, setPembelians] = useState<Pembelian[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    no_faktur: "",
    nama: "",
    tipe_pemasok: "",
    harga_deal: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPembelians();
  }, []);

  const fetchPembelians = async () => {
    try {
      setLoading(true);
      const res = await api.pembelian.list();
      setPembelians(res.data as Pembelian[]);
    } catch (error) {
      console.error("Failed to fetch pembelian:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSheet = (pembelian?: Pembelian) => {
    if (pembelian) {
      setEditingId(pembelian.id);
      setFormData({
        no_faktur: pembelian.no_faktur,
        nama: pembelian.nama,
        tipe_pemasok: pembelian.tipe_pemasok,
        harga_deal: pembelian.harga_deal.toString(),
      });
    } else {
      setEditingId(null);
      setFormData({
        no_faktur: "",
        nama: "",
        tipe_pemasok: "supplier",
        harga_deal: "",
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
    if (!formData.no_faktur || !formData.nama || !formData.harga_deal) return;
    
    setSubmitting(true);
    try {
      const payload = {
        no_faktur: formData.no_faktur,
        nama: formData.nama,
        tipe_pemasok: formData.tipe_pemasok,
        harga_deal: parseInt(formData.harga_deal.replace(/\D/g, ""), 10),
      };

      if (editingId) {
        await api.pembelian.update(editingId, payload);
      } else {
        await api.pembelian.create(payload);
      }
      await fetchPembelians();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save pembelian:", error);
      alert("Gagal menyimpan pembelian.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data pembelian ini?")) return;
    try {
      await api.pembelian.delete(id);
      await fetchPembelians();
    } catch (error) {
      console.error("Failed to delete pembelian:", error);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Data Pembelian
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola transaksi pembelian dari supplier atau pelanggan.
          </p>
        </div>
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="mr-2 size-4" />
          Tambah Pembelian
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pembelian</CardTitle>
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
                    <TableHead>Nama (Toko/Supplier)</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Harga Deal</TableHead>
                    <TableHead className="w-[100px] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pembelians.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Tidak ada data pembelian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pembelians.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.no_faktur}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell className="capitalize">{item.tipe_pemasok}</TableCell>
                        <TableCell>{formatRupiah(item.harga_deal)}</TableCell>
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
            <SheetTitle>{editingId ? "Edit Pembelian" : "Tambah Pembelian"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Ubah data transaksi pembelian di bawah ini."
                : "Masukkan detail transaksi pembelian baru."}
            </SheetDescription>
          </SheetHeader>
          
          <form id="pembelian-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3">
              <Label htmlFor="no_faktur">Nomor Faktur</Label>
              <Input
                id="no_faktur"
                value={formData.no_faktur}
                onChange={(e) => setFormData({ ...formData, no_faktur: e.target.value })}
                placeholder="Contoh: INV-2024-001"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="nama">Nama (Toko / Supplier)</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Toko Mas Jaya"
                required
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Label htmlFor="tipe_pemasok">Tipe Pemasok</Label>
              <select
                id="tipe_pemasok"
                value={formData.tipe_pemasok}
                onChange={(e) => setFormData({ ...formData, tipe_pemasok: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="supplier">Supplier</option>
                <option value="pelanggan">Pelanggan</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="harga_deal">Harga Deal (Rp)</Label>
              <Input
                id="harga_deal"
                type="text"
                value={formData.harga_deal}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, harga_deal: val });
                }}
                placeholder="Contoh: 10000000"
                required
              />
            </div>
          </form>

          <SheetFooter className="px-6 py-4 border-t mt-auto">
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCloseSheet}>
                Batal
              </Button>
              <Button type="submit" form="pembelian-form" className="flex-1" disabled={submitting}>
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
