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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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

interface BarangLanding {
  id: string;
  nama: string;
  karat: string;
  berat: number;
  harga: number;
  photo: string;
}

export default function BarangLandingPage() {
  const [items, setItems] = useState<BarangLanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    karat: "",
    berat: "",
    harga: "",
    photo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await api.barangLanding.list();
      setItems(res.data as BarangLanding[]);
      setPage(1);
    } catch (error) {
      console.error("Failed to fetch barang landing:", error);
      toast.error("Gagal memuat data barang landing.");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenSheet = (item?: BarangLanding) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        nama: item.nama,
        karat: item.karat ?? "",
        berat: item.berat?.toString() || "",
        harga: item.harga?.toString() || "",
        photo: item.photo ?? "",
      });
    } else {
      setEditingId(null);
      setFormData({ nama: "", karat: "", berat: "", harga: "", photo: "" });
    }
    setSheetOpen(true);
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
      toast.success("Foto berhasil diunggah.");
    } catch (err) {
      console.error("Upload gagal:", err);
      toast.error("Gagal mengupload foto");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;

    setSubmitting(true);
    try {
      const payload = {
        nama: formData.nama,
        karat: formData.karat,
        berat: parseFloat(formData.berat.replace(",", ".")) || 0,
        harga: parseInt(formData.harga.replace(/\D/g, ""), 10) || 0,
        photo: formData.photo,
      };

      if (editingId) {
        await api.barangLanding.update(editingId, payload);
        toast.success("Data barang landing berhasil diperbarui.");
      } else {
        await api.barangLanding.create(payload);
        toast.success("Data barang landing berhasil ditambahkan.");
      }
      await fetchItems();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save barang landing:", error);
      toast.error("Gagal menyimpan data barang landing.");
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
      await api.barangLanding.delete(deleteId);
      toast.success("Data barang landing berhasil dihapus.");
      await fetchItems();
    } catch (error) {
      console.error("Failed to delete barang landing:", error);
      toast.error("Gagal menghapus data barang landing.");
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
    () => items.filter((i) => i.nama.toLowerCase().includes(search.toLowerCase()) || i.karat.toLowerCase().includes(search.toLowerCase())),
    [items, search]
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
            Kelola Barang Landing
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola barang yang tampil di landing page website.
          </p>
        </div>
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="mr-2 size-4" />
          Tambah Barang Landing
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Barang Landing Page</CardTitle>
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
                  placeholder="Cari nama atau karat barang..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Karat</TableHead>
                      <TableHead>Berat (gr)</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Photo</TableHead>
                      <TableHead className="w-[100px] text-center">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Belum ada data barang landing.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                          <TableCell className="font-medium">{item.nama}</TableCell>
                          <TableCell>{item.karat}</TableCell>
                          <TableCell>{item.berat}</TableCell>
                          <TableCell>{formatRupiah(item.harga)}</TableCell>
                          <TableCell>
                            {item.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.photo}
                                alt={item.nama}
                                className="size-10 rounded-md border object-cover"
                              />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col gap-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{editingId ? "Ubah Barang Landing" : "Tambah Barang Landing"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Perbarui data barang yang tampil di landing page."
                : "Isi formulir berikut untuk menambahkan barang ke landing page."}
            </SheetDescription>
          </SheetHeader>

          <form id="barang-landing-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3">
              <Label htmlFor="nama">Nama Barang</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Cincin Emas 24K"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="karat">Karat</Label>
              <Input
                id="karat"
                value={formData.karat}
                onChange={(e) => setFormData({ ...formData, karat: e.target.value })}
                placeholder="Contoh: 24"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="berat">Berat (gr)</Label>
              <Input
                id="berat"
                type="text"
                value={formData.berat}
                onChange={(e) => setFormData({ ...formData, berat: e.target.value })}
                placeholder="Contoh: 5.500"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="harga">Harga (Rp)</Label>
              <Input
                id="harga"
                type="text"
                value={formData.harga ? formatRupiah(parseInt(formData.harga.toString().replace(/\D/g, "") || "0")).replace("Rp", "").trim() : ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, harga: val });
                }}
                placeholder="Contoh: 5000000"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="photo">Foto Barang</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.photo && (
                <div className="mt-2 relative h-32 w-32 overflow-hidden rounded-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="object-cover h-full w-full"
                  />
                </div>
              )}
            </div>
          </form>

          <SheetFooter className="px-6 py-4 border-t mt-auto">
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCloseSheet}>
                Batal
              </Button>
              <Button type="submit" form="barang-landing-form" className="flex-1" disabled={submitting}>
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
            <AlertDialogTitle>Hapus Barang Landing</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus data barang landing ini secara permanen. Tindakan ini tidak dapat dibatalkan.
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
