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
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, CheckCircle, XCircle, Search, FileDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Karat {
  id: string;
  name: string;
  harga: number;
}

interface BarangItem {
  id: string;
  barcode: string;
  nama: string;
  karat: string | number | Karat;
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
  is_approve: boolean;
  barang?: BarangItem;
  created_at?: string;
}

export default function PembelianPage() {
  const router = useRouter();

  const getKaratName = (karat: string | number | Karat | null | undefined) => {
    if (!karat) return "-";
    if (typeof karat === "object") return karat.name;
    return String(karat);
  };

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
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appliedRange, setAppliedRange] = useState<{ from: string; to: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        setCurrentRole(user.role?.toLowerCase());
      } catch {}
    }
    fetchPembelians();
  }, []);

  const fetchPembelians = async (range?: { from: string; to: string } | null) => {
    const r = range !== undefined ? range : appliedRange;
    try {
      setLoading(true);
      const res = await api.pembelian.list(r?.from, r?.to);
      setPembelians(res.data as Pembelian[]);
    } catch (error) {
      console.error("Failed to fetch pembelian:", error);
      toast.error("Gagal memuat data pembelian.");
    } finally {
      setLoading(false);
    }
  };

  const applyDateRange = async () => {
    if (!dateFrom || !dateTo) {
      toast.error("Pilih tanggal awal dan tanggal akhir terlebih dahulu.");
      return;
    }
    if (dateFrom > dateTo) {
      toast.error("Tanggal awal tidak boleh setelah tanggal akhir.");
      return;
    }
    const range = { from: dateFrom, to: dateTo };
    setAppliedRange(range);
    setPage(1);
    await fetchPembelians(range);
  };

  const resetDateRange = async () => {
    setDateFrom("");
    setDateTo("");
    setAppliedRange(null);
    setPage(1);
    await fetchPembelians(null);
  };

  const handleExport = async () => {
    if (!appliedRange) return;
    setExporting(true);
    try {
      await api.pembelian.export(appliedRange.from, appliedRange.to);
      toast.success("Data pembelian berhasil diexport ke Excel.");
    } catch (error) {
      console.error("Failed to export pembelian:", error);
      toast.error("Gagal mengexport data pembelian.");
    } finally {
      setExporting(false);
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
        toast.success("Data pembelian berhasil diperbarui.");
      } else {
        await api.pembelian.create(payload);
        toast.success("Data pembelian berhasil ditambahkan.");
      }
      await fetchPembelians();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save pembelian:", error);
      toast.error("Gagal menyimpan pembelian.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmApprove = (id: string) => {
    setApproveId(id);
  };

  const executeApprove = async () => {
    if (!approveId) return;
    try {
      await api.pembelian.approve(approveId);
      toast.success("Transaksi pembelian berhasil disetujui.");
      await fetchPembelians();
    } catch (error) {
      console.error("Failed to approve pembelian:", error);
      toast.error("Gagal menyetujui pembelian.");
    } finally {
      setApproveId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await api.pembelian.delete(deleteId);
      toast.success("Data pembelian berhasil dihapus.");
      await fetchPembelians();
    } catch (error) {
      console.error("Failed to delete pembelian:", error);
      toast.error("Gagal menghapus pembelian.");
    } finally {
      setDeleteId(null);
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
      toast.error("Gagal memuat detail pembelian.");
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

  const isSales = currentRole === "sales";
  const isKasir = currentRole === "kasir";
  const isAdmin = currentRole === "admin";
  const canDelete = isSales || isAdmin;

  const filteredData = useMemo(
    () => pembelians.filter((p) => p.no_faktur.toLowerCase().includes(search.toLowerCase()) || p.nama.toLowerCase().includes(search.toLowerCase())),
    [pembelians, search]
  );
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * perPage, page * perPage),
    [filteredData, page, perPage]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Transaksi Pembelian
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau dan kelola seluruh transaksi pembelian dari pemasok.
          </p>
        </div>
        {isSales && (
          <Button onClick={() => router.push("/pembelian/tambah")}>
            <Plus className="mr-2 size-4" />
            Buat Pembelian Baru
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Riwayat Transaksi Pembelian</CardTitle>
          {appliedRange && (
            <>
              <Button
                variant="default"
                className="h-9"
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <FileDown className="mr-2 size-4" />}
                Export Excel
              </Button>
            </>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
            <div className="mb-4 flex flex-col gap-3 rounded-md py-3">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="date-from" className="text-xs">Tanggal Awal</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-9 w-[170px]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="date-to" className="text-xs">Tanggal Akhir</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-9 w-[170px]"
                  />
                </div>
                <Button className="h-9" onClick={applyDateRange}>Cari</Button>
              </div>
              {appliedRange && (
                <p className="text-xs text-muted-foreground">
                  Menampilkan data dari <span className="font-medium">{appliedRange.from}</span> s.d.{" "}
                  <span className="font-medium">{appliedRange.to}</span>.
                </p>
              )}
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari no. faktur atau nama pemasok..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Faktur</TableHead>
                    <TableHead>Nama Pemasok</TableHead>
                    <TableHead>Tipe Pemasok</TableHead>
                    <TableHead>Harga Kesepakatan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[140px] text-center">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Belum ada data transaksi pembelian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.no_faktur}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell className="capitalize">{item.tipe_pemasok}</TableCell>
                        <TableCell>{formatRupiah(item.harga_deal)}</TableCell>
                        <TableCell>
                          {item.is_approve ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                              <CheckCircle className="size-3" />
                              Disetujui
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                              <XCircle className="size-3" />
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDetail(item.id)}
                            title="Detail"
                          >
                            <svg className="size-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </Button>
                          {isKasir && !item.is_approve && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmApprove(item.id)}
                              title="Setujui"
                            >
                              <CheckCircle className="size-4 text-green-600" />
                            </Button>
                          )}
                          {isSales && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenSheet(item)}
                              title="Edit"
                            >
                              <Pencil className="size-4 text-blue-600" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDelete(item.id)}
                              title="Hapus"
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} perPage={perPage} onPerPageChange={setPerPage} />
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
                    <h4 className="text-sm font-semibold mb-2">Detail Barang</h4>
                    {detailPembelian.barang ? (
                      <div className="rounded-md border p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <Label className="text-muted-foreground text-xs">Barcode</Label>
                          <p className="font-medium text-sm font-mono">{detailPembelian.barang.barcode}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Nama Barang</Label>
                          <p className="font-medium text-sm">{detailPembelian.barang.nama}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Karat</Label>
                          <p className="font-medium text-sm">{getKaratName(detailPembelian.barang.karat)}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Berat (gr)</Label>
                          <p className="font-medium text-sm">{detailPembelian.barang.berat.toFixed(3)}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Harga</Label>
                          <p className="font-medium text-sm">{formatRupiah(detailPembelian.barang.harga)}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Kondisi</Label>
                          <p className="font-medium text-sm capitalize">{detailPembelian.barang.kondisi}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4 border rounded-md">Tidak ada barang.</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pembelian</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data pembelian ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!approveId} onOpenChange={(open) => !open && setApproveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setujui Pembelian</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyetujui transaksi pembelian ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeApprove} className="bg-green-600 hover:bg-green-700">
              Setujui
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
