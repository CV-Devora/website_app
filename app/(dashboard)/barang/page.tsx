"use client";

import { useEffect, useState, useMemo } from "react";
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

import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Search } from "lucide-react";
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
  harga: number;
  kondisi: string;
  baki_id: string;
  photo: string;
}

export default function BarangPage() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [karatList, setKaratList] = useState<Karat[]>([]);
  const [bakiList, setBakiList] = useState<Baki[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    barcode: "",
    nama: "",
    karat_id: "",
    berat: "",
    harga: "",
    kondisi: "baru",
    baki_id: "",
    photo: "",
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [resBarang, resKarat, resBaki, resPenjualan] = await Promise.all([
        api.barang.list(),
        api.karat.list(),
        api.baki.list(),
        api.penjualan.list(),
      ]);
      const allBarang = resBarang.data as Barang[];
      const soldIds = new Set<string>();
      const penjualans = resPenjualan.data as any[];
      penjualans.forEach((p: any) => {
        if (p.barang) {
          p.barang.forEach((b: any) => soldIds.add(b.id));
        }
      });
      setBarangs(allBarang.filter((b) => !soldIds.has(b.id)));
      setKaratList(resKarat.data as Karat[]);
      setBakiList(resBaki.data as Baki[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBarangs = async () => {
    try {
      const [resBarang, resPenjualan] = await Promise.all([
        api.barang.list(),
        api.penjualan.list(),
      ]);
      const allBarang = resBarang.data as Barang[];
      const soldIds = new Set<string>();
      const penjualans = resPenjualan.data as any[];
      penjualans.forEach((p: any) => {
        if (p.barang) {
          p.barang.forEach((b: any) => soldIds.add(b.id));
        }
      });
      setBarangs(allBarang.filter((b) => !soldIds.has(b.id)));
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
        harga: barang.harga?.toString() || "",
        kondisi: barang.kondisi || "baru",
        baki_id: barang.baki_id || "",
        photo: barang.photo || "",
      });
    } else {
      setEditingId(null);
      
      // Fetch latest barcode when creating new
      let nextBarcode = "";
      try {
        const resBarcode = await api.barang.latestBarcode();
        nextBarcode = String(resBarcode.data + 1).padStart(9, "0");
      } catch (err) {
        console.error("Failed to fetch latest barcode", err);
      }

      setFormData({
        barcode: nextBarcode,
        nama: "",
        karat_id: "",
        berat: "",
        harga: "",
        kondisi: "baru",
        baki_id: "",
        photo: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.berat || !formData.harga) return;
    
    setSubmitting(true);
    try {
      const payload = {
        barcode: formData.barcode,
        nama: formData.nama,
        karat_id: formData.karat_id || null,
        berat: parseFloat(formData.berat.replace(",", ".")) || 0,
        harga: parseInt(formData.harga.replace(/\D/g, ""), 10) || 0,
        kondisi: formData.kondisi,
        baki_id: formData.baki_id || null,
        photo: formData.photo,
      };

      if (editingId) {
        await api.barang.update(editingId, payload);
        toast.success("Data barang berhasil diperbarui.");
      } else {
        await api.barang.create(payload);
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
    () => barangs.filter((b) => b.barcode.toLowerCase().includes(search.toLowerCase()) || b.nama.toLowerCase().includes(search.toLowerCase())),
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manajemen Inventaris
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola stok dan data seluruh perhiasan di inventaris toko.
          </p>
        </div>
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="mr-2 size-4" />
          Tambah Barang Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Stok Barang</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barcode</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kadar</TableHead>
                    <TableHead>Berat (gr)</TableHead>
                    <TableHead>Harga Jual</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead className="w-[100px] text-center">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Belum ada data barang dalam inventaris.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-sm">{item.barcode}</TableCell>
                        <TableCell className="font-medium">{item.nama}</TableCell>
                        <TableCell>{getKaratName(item.karat)}</TableCell>
                        <TableCell>{item.berat}</TableCell>
                        <TableCell>{formatRupiah(item.harga)}</TableCell>
                        <TableCell className="capitalize">{item.kondisi}</TableCell>
                        <TableCell className="text-right space-x-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseSheet}>
          <div className="bg-background rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">{editingId ? "Edit Barang" : "Tambah Barang"}</h2>
                <p className="text-sm text-muted-foreground">
                  {editingId
                    ? "Ubah data barang di bawah ini."
                    : "Masukkan detail barang baru ke inventaris."}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseSheet}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>

            <form id="barang-form" onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 overflow-y-auto">
              <div className="flex flex-col gap-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  disabled
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="nama">Nama Barang</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Cincin Emas Polos"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="karat_id">Kadar / Karat</Label>
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

                <div className="flex flex-col gap-2">
                  <Label htmlFor="berat">Berat (gr)</Label>
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="harga">Harga (Rp)</Label>
                <Input
                  id="harga"
                  type="text"
                  value={formData.harga ? formatRupiah(parseInt(formData.harga.toString().replace(/\D/g, "") || "0")).replace("Rp", "").trim() : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, harga: val });
                  }}
                  placeholder="0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="kondisi">Kondisi</Label>
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

                <div className="flex flex-col gap-2">
                  <Label htmlFor="baki_id">Baki</Label>
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="photo">Foto Barang</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.photo && (
                  <div className="mt-2 relative h-32 w-32 overflow-hidden rounded-md border">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="object-cover h-full w-full"
                    />
                  </div>
                )}
              </div>
            </form>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseDetail}>
          <div className="bg-background rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Detail Barang</h2>
                <p className="text-sm text-muted-foreground">Rincian data untuk barang ini.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseDetail}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-muted-foreground">Foto Barang</span>
                {selectedBarang.photo ? (
                  <div className="relative w-full h-64 rounded-md border overflow-hidden">
                    <img
                      src={selectedBarang.photo}
                      alt={selectedBarang.nama}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-muted border rounded-md flex items-center justify-center text-muted-foreground">
                    Tidak ada foto
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground">Barcode</span>
                  <p className="font-medium text-base">{selectedBarang.barcode}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground">Nama Barang</span>
                  <p className="font-medium text-base">{selectedBarang.nama}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground">Kadar</span>
                  <p className="font-medium text-base">{getKaratName(selectedBarang.karat || selectedBarang)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground">Berat</span>
                  <p className="font-medium text-base">{selectedBarang.berat} gr</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground">Harga</span>
                  <p className="font-medium text-base">{formatRupiah(selectedBarang.harga)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground">Kondisi</span>
                  <p className="font-medium text-base capitalize">{selectedBarang.kondisi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
