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
import { Pencil, Trash2, Plus, Loader2, Search, FileDown } from "lucide-react";
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
  const router = useRouter();
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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appliedRange, setAppliedRange] = useState<{ from: string; to: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(raw) as User;
        setCurrentRole(user.role?.toLowerCase());
      } catch {}
    }
    fetchData();
  }, []);

  const fetchData = async (range?: { from: string; to: string } | null) => {
    const r = range !== undefined ? range : appliedRange;
    try {
      setLoading(true);
      const [resPenjualan, resUsers] = await Promise.all([
        api.penjualan.list(r?.from, r?.to),
        api.users.list(),
      ]);
      setPenjualans(resPenjualan.data as Penjualan[]);
      setUsers(resUsers.data as User[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Gagal memuat data penjualan.");
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
    await fetchData(range);
  };

  const resetDateRange = async () => {
    setDateFrom("");
    setDateTo("");
    setAppliedRange(null);
    setPage(1);
    await fetchData(null);
  };

  const handleExport = async () => {
    if (!appliedRange) return;
    setExporting(true);
    try {
      await api.penjualan.export(appliedRange.from, appliedRange.to);
      toast.success("Data penjualan berhasil diexport ke Excel.");
    } catch (error) {
      console.error("Failed to export penjualan:", error);
      toast.error("Gagal mengexport data penjualan.");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [penjualans]);

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
        toast.success("Data penjualan berhasil diperbarui.");
      } else {
        await api.penjualan.create(payload);
        toast.success("Data penjualan berhasil ditambahkan.");
      }

      await fetchData();

      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save penjualan:", error);
      toast.error("Gagal menyimpan penjualan.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await api.penjualan.delete(deleteId);
      toast.success("Data penjualan berhasil dihapus.");
      await fetchData();
    } catch (error) {
      console.error("Failed to delete penjualan:", error);
      toast.error("Gagal menghapus penjualan.");
    } finally {
      setDeleteId(null);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const filteredData = useMemo(
    () => penjualans.filter((p) => p.no_faktur.toLowerCase().includes(search.toLowerCase()) || p.nama.toLowerCase().includes(search.toLowerCase())),
    [penjualans, search]
  );
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * perPage, page * perPage),
    [filteredData, page, perPage]
  );

  const getSalesName = (kodeSales: string) => {
    const user = users.find((u) => u.id === kodeSales);
    return user ? user.nama : kodeSales;
  };

  const salesUsers = users.filter((u) => u.role === "sales");

  const isSales = currentRole === "sales";
  const isAdmin = currentRole === "admin";
  const canDelete = isSales || isAdmin;
  const showAksi = isSales || isAdmin;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Transaksi Penjualan
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau dan kelola seluruh transaksi penjualan kepada pelanggan.
          </p>
        </div>
        {isSales && (
          <Button onClick={() => router.push("/penjualan/tambah")}>
            <Plus className="mr-2 size-4" />
            Buat Penjualan Baru
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Riwayat Transaksi Penjualan</CardTitle>
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
                placeholder="Cari no. faktur atau nama pelanggan..."
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
                    <TableHead>Nama Pelanggan</TableHead>
                    <TableHead>Total Nilai</TableHead>
                    <TableHead>Nama Sales</TableHead>
                    {showAksi && <TableHead className="w-[100px] text-center">Tindakan</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={showAksi ? 5 : 4} className="h-24 text-center">
                        Belum ada data transaksi penjualan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.no_faktur}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell>{formatRupiah(item.total_harga)}</TableCell>
                        <TableCell>{getSalesName(item.kode_sales)}</TableCell>
                        {showAksi && (
                          <TableCell className="text-center space-x-1">
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
                        )}
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
            <SheetTitle>{editingId ? "Ubah Data Penjualan" : "Tambah Penjualan Baru"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Perbarui informasi transaksi penjualan di bawah ini."
                : "Isi formulir berikut untuk mencatat transaksi penjualan baru."}
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
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="total_harga">Total Nilai (Rp)</Label>
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
              <Label htmlFor="kode_sales">Nama Sales</Label>
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus data transaksi penjualan ini secara permanen. Tindakan ini tidak dapat dibatalkan.
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
    </div>
  );
}
