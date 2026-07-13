"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Pagination } from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

interface BarangItem {
  id: string;
  barcode: string;
  nama: string;
  karat: number;
  berat: number;
  harga: number;
  photo: string;
  kondisi: string;
  baki_id: string | null;
}

interface Pembelian {
  id: string;
  no_faktur: string;
  nama: string;
  tipe_pemasok: string;
  harga_deal: number;
  barang?: BarangItem[];
  created_at?: string;
}

export default function PembelianPage() {
  const router = useRouter();
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
  const [detailPembelian, setDetailPembelian] = useState<Pembelian | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

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

  useEffect(() => {
    setPage(1);
  }, [pembelians]);

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

  const handleOpenDetail = async (id: string) => {
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const res = await api.pembelian.get(id);
      setDetailPembelian(res.data as Pembelian);
    } catch (error) {
      console.error("Failed to fetch detail:", error);
      alert("Gagal memuat detail pembelian.");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const totalPages = Math.ceil(pembelians.length / perPage);
  const paginatedData = useMemo(
    () => pembelians.slice((page - 1) * perPage, page * perPage),
    [pembelians, page, perPage]
  );

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
        <Button onClick={() => router.push("/pembelian/tambah")}>
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
            <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Faktur</TableHead>
                    <TableHead>Nama Pemasok</TableHead>
                    <TableHead>Tipe Pemasok</TableHead>
                    <TableHead>Total Harga</TableHead>
                    <TableHead className="w-[100px] text-center">Aksi</TableHead>
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
                    paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.no_faktur}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell className="capitalize">{item.tipe_pemasok}</TableCell>
                        <TableCell>{formatRupiah(item.harga_deal)}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDetail(item.id)}
                            title="Detail"
                          >
                            <svg className="size-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </Button>
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
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
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

      {detailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDetailOpen(false)}>
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Detail Pembelian</h2>
                <p className="text-sm text-muted-foreground">Informasi lengkap transaksi pembelian.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setDetailOpen(false)}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>

            <div className="p-6 overflow-y-hidden flex-1">
              {detailLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
              ) : detailPembelian ? (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">No. Faktur</Label>
                      <p className="font-medium">{detailPembelian.no_faktur}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Tipe Pemasok</Label>
                      <p className="font-medium capitalize">{detailPembelian.tipe_pemasok}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Nama Pemasok</Label>
                      <p className="font-medium">{detailPembelian.nama}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Total Harga</Label>
                      <p className="font-medium">{formatRupiah(detailPembelian.harga_deal)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Daftar Barang</h4>
                    <div className="rounded-md border mb-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Barcode</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Karat</TableHead>
                            <TableHead>Berat (gr)</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Kondisi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="overflow-y-auto">
                          {detailPembelian.barang && detailPembelian.barang.length > 0 ? (
                            detailPembelian.barang.map((b) => (
                              <TableRow key={b.id}>
                                <TableCell className="text-xs">{b.barcode}</TableCell>
                                <TableCell>{b.nama}</TableCell>
                                <TableCell>{b.karat}</TableCell>
                                <TableCell>{b.berat.toFixed(3)}</TableCell>
                                <TableCell>{formatRupiah(b.harga)}</TableCell>
                                <TableCell className="capitalize">{b.kondisi}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-16 text-center text-muted-foreground">
                                Tidak ada barang.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
