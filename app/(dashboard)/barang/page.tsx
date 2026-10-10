"use client";

import { useEffect, useState, useMemo } from "react";
import { api, resolvePhotoUrl } from "@/lib/api";
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

import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Search, Upload, FileDown } from "lucide-react";
import { BarangImportDialog } from "@/components/barang-import-dialog";
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

interface Baki {
  id: string;
  nama: string;
}

interface Barang {
  id: string;
  barcode: string;
  nama: string;
  karat: number;
  berat: number;
  berat_atribut: number;
  harga: number;
  kondisi: string;
  baki_id: string;
  photo: string;
  grup: string;
}

interface PenjualanWithBarang {
  barang?: Array<{ id?: string }>;
}

function filterSoldBarangs(barangs: Barang[], penjualanData: unknown): Barang[] {
  if (!Array.isArray(penjualanData)) return barangs;

  const soldIds = new Set(
    (penjualanData as PenjualanWithBarang[]).flatMap((penjualan) =>
      Array.isArray(penjualan.barang)
        ? penjualan.barang.flatMap((barang) => (barang.id ? [barang.id] : []))
        : []
    )
  );

  return barangs.filter((barang) => !soldIds.has(barang.id));
}

function getNextBarcode(value: string | number): string {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0
    ? String(number + 1).padStart(9, "0")
    : "000000001";
}

export default function BarangPage() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [karatList, setKaratList] = useState<Karat[]>([]);
  const [bakiList, setBakiList] = useState<Baki[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importKey, setImportKey] = useState(0);
  const [exporting, setExporting] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    barcode: "",
    nama: "",
    karat_id: "",
    berat: "",
    berat_atribut: "",
    harga: "",
    kondisi: "baru",
    baki_id: "",
    photo: "",
    grup: "",
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const selectedKarat = karatList.find((karat) => karat.id === formData.karat_id);
    const berat = parseFloat(formData.berat.replace(",", "."));
    const hargaPerGram = selectedKarat?.harga ?? 0;
    const calculatedHarga =
      selectedKarat && Number.isFinite(berat) && berat > 0
        ? String(Math.round(hargaPerGram * berat))
        : "";

    setFormData((previous) =>
      previous.harga === calculatedHarga
        ? previous
        : { ...previous, harga: calculatedHarga }
    );
  }, [formData.berat, formData.karat_id, karatList]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const resBarang = await api.barang.list();
      const allBarang = resBarang.data as Barang[];
      setBarangs(allBarang);

      const [resKarat, resBaki, resPenjualan] = await Promise.allSettled([
        api.karat.list(),
        api.baki.list(),
        api.penjualan.list(),
      ]);
      if (resKarat.status === "fulfilled") setKaratList(resKarat.value.data as Karat[]);
      if (resBaki.status === "fulfilled") setBakiList(resBaki.value.data as Baki[]);
      if (resPenjualan.status === "fulfilled") {
        setBarangs(filterSoldBarangs(allBarang, resPenjualan.value.data));
      } else {
        console.error("Failed to fetch penjualan; showing all barang:", resPenjualan.reason);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role?.toLowerCase() === "admin");
      } catch {
        console.error("Failed to parse user from local storage");
      }
    }
  }, []);

  const fetchBarangs = async () => {
    try {
      const resBarang = await api.barang.list();
      const allBarang = resBarang.data as Barang[];
      setBarangs(allBarang);

      try {
        const resPenjualan = await api.penjualan.list();
        setBarangs(filterSoldBarangs(allBarang, resPenjualan.data));
      } catch (error) {
        console.error("Failed to fetch penjualan; showing all barang:", error);
      }
    } catch (error) {
      console.error("Failed to fetch barang:", error);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [barangs]);

  const handleOpenSheet = async (barang?: Barang) => {
    if (barang) {
      setEditingId(barang.id);
      setFormData({
        barcode: barang.barcode,
        nama: barang.nama,
        karat_id: (barang as any).karat_id || (barang.karat && (barang.karat as any).id) || "",
        berat: barang.berat?.toString() || "",
        berat_atribut: barang.berat_atribut?.toString() || "",
        harga: barang.harga?.toString() || "",
        kondisi: barang.kondisi || "baru",
        baki_id: barang.baki_id || "",
        photo: barang.photo || "",
        grup: barang.grup || "",
      });
    } else {
      setEditingId(null);

      // Fetch latest barcode when creating new
      let nextBarcode = "000000001";
      try {
        const resBarcode = await api.barang.latestBarcode();
        nextBarcode = getNextBarcode(resBarcode.data);
      } catch (err) {
        console.error("Failed to fetch latest barcode", err);
      }

      setFormData({
        barcode: nextBarcode,
        nama: "",
        karat_id: "",
        berat: "",
        berat_atribut: "",
        harga: "",
        kondisi: "baru",
        baki_id: "",
        photo: "",
        grup: "",
      });
    }
    setSheetOpen(true);
  };

  const handleOpenDetail = (barang: Barang) => {
    setSelectedBarang(barang);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedBarang(null);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingId(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await api.upload(file);
      setFormData((prev) => ({ ...prev, photo: url }));
    } catch (err) {
      console.error("Upload gagal:", err);
      toast.error("Gagal mengupload foto");
    }
  };

  const fetchBakiList = async () => {
    try {
      const res = await api.baki.list();
      setBakiList(res.data as Baki[]);
    } catch (error) {
      console.error("Failed to fetch baki:", error);
    }
  };

  const handleImported = async () => {
    await fetchBarangs();
    await fetchBakiList();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await api.barang.export();
      toast.success("Data barang berhasil diexport ke Excel.");
    } catch (error) {
      console.error("Failed to export barang:", error);
      toast.error("Gagal mengexport data barang.");
    } finally {
      setExporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.karat_id || !formData.berat || !formData.harga) return;

    setSubmitting(true);
    try {
      const payload = {
        barcode: formData.barcode,
        nama: formData.nama,
        karat_id: formData.karat_id || null,
        berat: parseFloat(formData.berat.replace(",", ".")) || 0,
        berat_atribut: parseFloat(formData.berat_atribut.replace(",", ".")) || 0,
        harga: parseInt(formData.harga.replace(/\D/g, ""), 10) || 0,
        kondisi: formData.kondisi,
        baki_id: formData.baki_id || null,
        photo: formData.photo,
        grup: formData.grup || null,
      };

      if (editingId) {
        await api.barang.update(editingId, payload);
        toast.success("Data barang berhasil diperbarui.");
      } else {
        try {
          await api.barang.create(payload);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (!message.includes("barang_barcode_key")) throw error;

          // The backend barcode counter can include deleted records differently.
          // Move forward and retry once instead of submitting the same barcode.
          const retryPayload = { ...payload, barcode: getNextBarcode(payload.barcode) };
          await api.barang.create(retryPayload);
          setFormData((previous) => ({ ...previous, barcode: retryPayload.barcode }));
        }
        toast.success("Data barang berhasil ditambahkan.");
      }
      await fetchBarangs();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save barang:", error);
      toast.error("Gagal menyimpan barang.");
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
      await api.barang.delete(deleteId);
      toast.success("Data barang berhasil dihapus.");
      await fetchBarangs();
    } catch (error) {
      console.error("Failed to delete barang:", error);
      toast.error("Gagal menghapus data barang.");
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
    () => {
      const query = search.toLowerCase();
      return barangs.filter((b) =>
        String(b.barcode ?? "").toLowerCase().includes(query) ||
        String(b.nama ?? "").toLowerCase().includes(query)
      );
    },
    [barangs, search]
  );
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * perPage, page * perPage),
    [filteredData, page, perPage]
  );

  const getKaratName = (item: any) => {
    if (item && item.name) return item.name;
    const karatId = item?.karat_id || item;
    const k = karatList.find((k) => k.id === karatId);
    return k ? k.name : "-";
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full min-w-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Manajemen Inventaris
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kelola stok dan data seluruh perhiasan di inventaris toko.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center h-9" onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <FileDown className="mr-1.5 size-4" />}
            Export Excel
          </Button>
          {isAdmin && (
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center h-9" onClick={() => { setImportKey((k) => k + 1); setImportOpen(true); }}>
              <Upload className="mr-1.5 size-4" />
              Import Excel
            </Button>
          )}
          <Button size="sm" className="w-full sm:w-auto justify-center h-9" onClick={() => handleOpenSheet()}>
            <Plus className="mr-1.5 size-4" />
            Tambah Barang
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden min-w-0">
        <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg">Daftar Stok Barang</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Cari barcode atau nama barang..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="rounded-md border overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Nama Barang</TableHead>
                      <TableHead>Kadar</TableHead>
                      <TableHead>Berat (gr)</TableHead>
                      <TableHead>Berat Atribut (gr)</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Harga Jual</TableHead>
                      <TableHead>Kondisi</TableHead>
                      <TableHead className="w-[110px] text-center">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          Belum ada data barang dalam inventaris.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-xs sm:text-sm font-mono">{item.barcode}</TableCell>
                          <TableCell className="font-medium">{item.nama}</TableCell>
                          <TableCell>{getKaratName(item.karat)}</TableCell>
                          <TableCell>{item.berat}</TableCell>
                          <TableCell>{item.berat_atribut ?? 0}</TableCell>
                          <TableCell>{(item as any).grup || "-"}</TableCell>
                          <TableCell>{formatRupiah(item.harga)}</TableCell>
                          <TableCell className="capitalize">{item.kondisi}</TableCell>
                          <TableCell className="text-right space-x-1 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDetail(item)}
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
                              onClick={() => confirmDelete(item.id)}
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
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} perPage={perPage} onPerPageChange={setPerPage} />
            </>
          )}
        </CardContent>
      </Card>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4" onClick={handleCloseSheet}>
          <div className="bg-background rounded-xl shadow-xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b">
              <div>
                <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Barang" : "Tambah Barang"}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {editingId
                    ? "Ubah data barang di bawah ini."
                    : "Masukkan detail barang baru ke inventaris."}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseSheet}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>

            <form id="barang-form" onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="barcode" className="text-xs sm:text-sm">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  disabled
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nama" className="text-xs sm:text-sm">Nama Barang</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Cincin Emas Polos"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="karat_id" className="text-xs sm:text-sm">Kadar / Karat</Label>
                  <select
                    id="karat_id"
                    value={formData.karat_id}
                    onChange={(e) => setFormData({ ...formData, karat_id: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                  >
                    <option value="">Pilih</option>
                    {karatList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="berat" className="text-xs sm:text-sm">Berat (gr)</Label>
                  <Input
                    id="berat"
                    type="text"
                    value={formData.berat}
                    onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                    placeholder="0.000"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="berat_atribut" className="text-xs sm:text-sm">Berat Atribut (gr)</Label>
                <Input
                  id="berat_atribut"
                  type="text"
                  value={formData.berat_atribut}
                  onChange={(e) => setFormData({ ...formData, berat_atribut: e.target.value })}
                  placeholder="0.000"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="harga" className="text-xs sm:text-sm">Harga (Rp)</Label>
                <Input
                  id="harga"
                  type="text"
                  value={formData.harga ? formatRupiah(parseInt(formData.harga.toString().replace(/\D/g, "") || "0")).replace("Rp", "").trim() : ""}
                  placeholder="Pilih karat dan isi berat"
                  readOnly
                  disabled
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Harga otomatis: harga karat per gram × berat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="kondisi" className="text-xs sm:text-sm">Kondisi</Label>
                  <select
                    id="kondisi"
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="baru">Baru</option>
                    <option value="bekas">Bekas</option>
                    <option value="rusak">Rusak</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="baki_id" className="text-xs sm:text-sm">Baki</Label>
                  <select
                    id="baki_id"
                    value={formData.baki_id}
                    onChange={(e) => setFormData({ ...formData, baki_id: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Pilih Baki</option>
                    {bakiList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="grup" className="text-xs sm:text-sm">Group</Label>
                <Input
                  id="grup"
                  type="text"
                  value={formData.grup}
                  onChange={(e) => setFormData({ ...formData, grup: e.target.value })}
                  placeholder="Contoh: GRP-001"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="photo" className="text-xs sm:text-sm">Foto Barang</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {resolvePhotoUrl(formData.photo) && (
                  <div className="mt-2 relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-md border">
                    <img
                      src={resolvePhotoUrl(formData.photo)}
                      alt="Preview"
                      className="object-cover h-full w-full"
                    />
                  </div>
                )}
              </div>
            </form>

            <div className="flex items-center justify-end gap-2 px-4 sm:px-6 py-3.5 border-t bg-muted/20">
              <Button type="button" variant="outline" onClick={handleCloseSheet}>
                Batal
              </Button>
              <Button type="submit" form="barang-form" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}

      {detailOpen && selectedBarang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4" onClick={handleCloseDetail}>
          <div className="bg-background rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b">
              <div>
                <h2 className="text-base sm:text-lg font-semibold">Detail Barang</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Rincian data untuk barang ini.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseDetail}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
              <div className="flex flex-col gap-2">
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Foto Barang</span>
                {resolvePhotoUrl(selectedBarang.photo) ? (
                  <div className="relative w-full h-48 sm:h-64 rounded-lg border overflow-hidden">
                    <img
                      src={resolvePhotoUrl(selectedBarang.photo)}
                      alt={selectedBarang.nama}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 sm:h-56 bg-muted border rounded-lg flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
                    Tidak ada foto
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Barcode</span>
                  <p className="font-mono font-medium text-sm sm:text-base">{selectedBarang.barcode}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Nama Barang</span>
                  <p className="font-medium text-sm sm:text-base">{selectedBarang.nama}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Kadar</span>
                  <p className="font-medium text-sm sm:text-base">{getKaratName(selectedBarang.karat || selectedBarang)}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Berat</span>
                  <p className="font-medium text-sm sm:text-base">{selectedBarang.berat} gr</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Berat Atribut</span>
                  <p className="font-medium text-sm sm:text-base">{selectedBarang.berat_atribut ?? 0} gr</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Harga</span>
                  <p className="font-medium text-sm sm:text-base">{formatRupiah(selectedBarang.harga)}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Kondisi</span>
                  <p className="font-medium text-sm sm:text-base capitalize">{selectedBarang.kondisi}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground">Group</span>
                  <p className="font-medium text-sm sm:text-base">{selectedBarang.grup || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BarangImportDialog key={importKey} open={importOpen} onOpenChange={setImportOpen} onImported={handleImported} />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Barang</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data barang ini? Tindakan ini tidak dapat dibatalkan.
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
