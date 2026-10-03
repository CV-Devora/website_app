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
import { Pencil, Trash2, Plus, Loader2, Search, FileDown, Eye, X } from "lucide-react";
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
  kode_sales: number | null;
  harga_gram: number;
  harga_jual: number;
  ongkos: number;
  cash: number;
  transfer: number;
  debet: number;
  created_at: string;
  barang?: { nama: string; berat: number } | null;
}

interface User {
  id: string;
  nama: string;
  role: string;
  kode_sales?: number | null;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b pb-3 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default function PenjualanPage() {
  const router = useRouter();
  const [penjualans, setPenjualans] = useState<Penjualan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<Penjualan | null>(null);

  const [formData, setFormData] = useState({
    no_faktur: "",
    nama: "",
    total_harga: "",
    kode_sales: "",
    harga_gram: "",
    harga_jual: "",
    ongkos: "",
    cash: "",
    transfer: "",
    debet: "",
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
        kode_sales: penjualan.kode_sales?.toString() ?? "",
        harga_gram: penjualan.harga_gram?.toString() ?? "0",
        harga_jual: penjualan.harga_jual?.toString() ?? "0",
        ongkos: penjualan.ongkos?.toString() ?? "0",
        cash: penjualan.cash?.toString() ?? "0",
        transfer: penjualan.transfer?.toString() ?? "0",
        debet: penjualan.debet?.toString() ?? "0",
      });
    } else {
      setEditingId(null);
      setFormData({
        no_faktur: "",
        nama: "",
        total_harga: "",
        kode_sales: "",
        harga_gram: "",
        harga_jual: "",
        ongkos: "",
        cash: "",
        transfer: "",
        debet: "",
      });
    }
    setSheetOpen(true);
  };

  const handleOpenDetail = (penjualan: Penjualan) => {
    setDetailItem(penjualan);
  };

  const handleCloseDetail = () => {
    setDetailItem(null);
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
      const num = (v: string) => parseInt(v.replace(/\D/g, "") || "0", 10);
      const payload = {
        no_faktur: formData.no_faktur,
        nama: formData.nama,
        total_harga: num(formData.total_harga),
        kode_sales: formData.kode_sales ? parseInt(formData.kode_sales, 10) : null,
        harga_gram: num(formData.harga_gram),
        harga_jual: num(formData.harga_jual),
        ongkos: num(formData.ongkos),
        cash: num(formData.cash),
        transfer: num(formData.transfer),
        debet: num(formData.debet),
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

  const formatTime = (value: string) => {
    if (!value) return "-";
    return value.slice(11, 16);
  };

  const filteredData = useMemo(
    () =>
      penjualans.filter(
        (p) =>
          p.no_faktur.toLowerCase().includes(search.toLowerCase()) ||
          p.nama.toLowerCase().includes(search.toLowerCase()) ||
          (p.barang?.nama ?? "").toLowerCase().includes(search.toLowerCase())
      ),
    [penjualans, search]
  );
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * perPage, page * perPage),
    [filteredData, page, perPage]
  );

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
                placeholder="Cari no. faktur, nama pelanggan, atau nama barang..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jam</TableHead>
                    <TableHead>No. Faktur</TableHead>
                    <TableHead>Nama Pelanggan</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Total Nilai</TableHead>
                    <TableHead>Cash</TableHead>
                    <TableHead>Transfer</TableHead>
                    <TableHead>Debet</TableHead>
                    <TableHead>Kode Sales</TableHead>
                    {showAksi && <TableHead className="w-[140px] text-center">Tindakan</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={showAksi ? 10 : 9} className="h-24 text-center">
                        Belum ada data transaksi penjualan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatTime(item.created_at)}
                        </TableCell>
                        <TableCell>{item.no_faktur}</TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell>{item.barang?.nama ?? "-"}</TableCell>
                        <TableCell>{formatRupiah(item.total_harga)}</TableCell>
                        <TableCell>{formatRupiah(item.cash ?? 0)}</TableCell>
                        <TableCell>{formatRupiah(item.transfer ?? 0)}</TableCell>
                        <TableCell>{formatRupiah(item.debet ?? 0)}</TableCell>
                        <TableCell>{item.kode_sales ?? "-"}</TableCell>
                        {showAksi && (
                          <TableCell className="text-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDetail(item)}
                              title="Detail"
                            >
                              <Eye className="size-4 text-slate-600" />
                            </Button>
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
              <Label htmlFor="harga_gram">Harga Gram (Rp)</Label>
              <Input
                id="harga_gram"
                type="text"
                value={formData.harga_gram}
                onChange={(e) =>
                  setFormData({ ...formData, harga_gram: e.target.value.replace(/\D/g, "") })
                }
                placeholder="Contoh: 750000"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="harga_jual">Harga Jual (Rp)</Label>
              <Input
                id="harga_jual"
                type="text"
                value={formData.harga_jual}
                onChange={(e) =>
                  setFormData({ ...formData, harga_jual: e.target.value.replace(/\D/g, "") })
                }
                placeholder="Contoh: 4500000"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="ongkos">Ongkos (Rp)</Label>
              <Input
                id="ongkos"
                type="text"
                value={formData.ongkos}
                onChange={(e) =>
                  setFormData({ ...formData, ongkos: e.target.value.replace(/\D/g, "") })
                }
                placeholder="Contoh: 100000"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="cash">Cash (Rp)</Label>
              <Input
                id="cash"
                type="text"
                value={formData.cash}
                onChange={(e) =>
                  setFormData({ ...formData, cash: e.target.value.replace(/\D/g, "") })
                }
                placeholder="Contoh: 2000000"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="transfer">Transfer (Rp)</Label>
              <Input
                id="transfer"
                type="text"
                value={formData.transfer}
                onChange={(e) =>
                  setFormData({ ...formData, transfer: e.target.value.replace(/\D/g, "") })
                }
                placeholder="Contoh: 2000000"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="debet">Debet (Rp)</Label>
              <Input
                id="debet"
                type="text"
                value={formData.debet}
                onChange={(e) =>
                  setFormData({ ...formData, debet: e.target.value.replace(/\D/g, "") })
                }
                placeholder="Contoh: 600000"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="kode_sales">Kode Sales</Label>
              <select
                id="kode_sales"
                value={formData.kode_sales}
                onChange={(e) => setFormData({ ...formData, kode_sales: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="" disabled>Pilih kode sales</option>
                {salesUsers.map((u) => (
                  <option key={u.id} value={u.kode_sales?.toString() ?? ""}>
                    {u.kode_sales != null ? `K${u.kode_sales} - ${u.nama}` : u.nama}
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

      <AlertDialog open={!!detailItem} onOpenChange={(open) => !open && handleCloseDetail()}>
        <AlertDialogContent
          className="w-[42rem]"
          style={{ maxWidth: "min(42rem, calc(100vw - 2rem))" }}
        >
          <AlertDialogCancel
            onClick={handleCloseDetail}
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 z-10 rounded-md p-1"
            title="Tutup"
          >
            <X className="size-5" />
          </AlertDialogCancel>

          <AlertDialogHeader>
            <AlertDialogTitle>Detail Transaksi Penjualan</AlertDialogTitle>
            <AlertDialogDescription>
              Informasi lengkap transaksi penjualan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {detailItem && (
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 py-2">
              <DetailRow label="Jam" value={formatTime(detailItem.created_at)} />
              <DetailRow label="No. Faktur" value={detailItem.no_faktur} />
              <DetailRow label="Nama Pelanggan" value={detailItem.nama} />
              <DetailRow label="Nama Barang" value={detailItem.barang?.nama ?? "-"} />
              <DetailRow
                label="Berat (gr)"
                value={detailItem.barang?.berat != null ? `${detailItem.barang.berat} gr` : "-"}
              />
              <DetailRow label="Debet" value={formatRupiah(detailItem.debet ?? 0)} />
              <DetailRow label="Harga Gram" value={formatRupiah(detailItem.harga_gram ?? 0)} />
              <DetailRow label="Cash" value={formatRupiah(detailItem.cash ?? 0)} />
              <DetailRow label="Harga Jual" value={formatRupiah(detailItem.harga_jual ?? 0)} />
              <DetailRow label="Transfer" value={formatRupiah(detailItem.transfer ?? 0)} />
              <DetailRow label="Ongkos" value={formatRupiah(detailItem.ongkos ?? 0)} />
              <DetailRow label="Total Nilai" value={formatRupiah(detailItem.total_harga)} />
              <DetailRow
                label="Kode Sales"
                value={detailItem.kode_sales != null ? String(detailItem.kode_sales) : "-"}
              />
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>

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
