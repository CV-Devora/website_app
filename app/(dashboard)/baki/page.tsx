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
import { Pencil, Trash2, Plus, Loader2, Eye, Search } from "lucide-react";
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

interface Baki {
  id: string;
  nama: string;
  created_at?: string;
  updated_at?: string;
}

interface BarangItem {
  id: string;
  barcode: string;
  nama: string;
  karat?: { id: string; name: string };
  berat: number;
  harga: number;
  kondisi: string;
  baki_id: string;
}

export default function BakiPage() {
  const [bakis, setBakis] = useState<Baki[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBaki, setSelectedBaki] = useState<Baki | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formNama, setFormNama] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailBarang, setDetailBarang] = useState<BarangItem[]>([]);
  const [detailBarangLoading, setDetailBarangLoading] = useState(false);

  useEffect(() => {
    fetchBakis();
  }, []);

  const fetchBakis = async () => {
    try {
      setLoading(true);
      const res = await api.baki.list();
      setBakis(res.data as Baki[]);
    } catch (error) {
      console.error("Failed to fetch baki:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [bakis]);

  const handleOpenModal = (baki?: Baki) => {
    if (baki) {
      setEditingId(baki.id);
      setFormNama(baki.nama);
    } else {
      setEditingId(null);
      setFormNama("");
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormNama("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await api.baki.update(editingId, { nama: formNama });
        toast.success("Data baki berhasil diperbarui.");
      } else {
        await api.baki.create({ nama: formNama });
        toast.success("Data baki berhasil ditambahkan.");
      }
      await fetchBakis();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save baki:", error);
      toast.error("Gagal menyimpan data baki.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDetail = async (baki: Baki) => {
    setSelectedBaki(baki);
    setDetailOpen(true);
    setDetailBarangLoading(true);
    try {
      const res = await api.barang.list();
      const allBarang = res.data as BarangItem[];
      setDetailBarang(allBarang.filter((b) => b.baki_id === baki.id));
    } catch (error) {
      console.error("Failed to fetch barang:", error);
      setDetailBarang([]);
    } finally {
      setDetailBarangLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedBaki(null);
    setDetailBarang([]);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await api.baki.delete(deleteId);
      toast.success("Data baki berhasil dihapus.");
      await fetchBakis();
    } catch (error) {
      console.error("Failed to delete baki:", error);
      toast.error("Gagal menghapus data baki.");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredData = useMemo(
    () => bakis.filter((b) => b.nama.toLowerCase().includes(search.toLowerCase())),
    [bakis, search]
  );
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * perPage, page * perPage),
    [filteredData, page, perPage]
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manajemen Baki
          </h1>
          <p className="text-sm text-muted-foreground">
            Atur dan kelola baki penyimpanan serta barang di dalamnya.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 size-4" />
          Tambah Baki Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Baki Penyimpanan</CardTitle>
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
                placeholder="Cari nama baki..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead>Nama Baki</TableHead>
                    <TableHead className="w-[130px] text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Belum ada data baki yang terdaftar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center text-muted-foreground">
                          {(page - 1) * perPage + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{item.nama}</TableCell>
                        <TableCell className="text-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDetail(item)}
                            title="Detail"
                          >
                            <Eye className="size-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal(item)}
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

      {/* Modal Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseModal}>
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full mx-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">{editingId ? "Ubah Data Baki" : "Tambah Baki Baru"}</h2>
                <p className="text-sm text-muted-foreground">
                  {editingId ? "Perbarui nama baki di bawah ini." : "Isi formulir berikut untuk menambahkan baki baru."}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>

            <form id="baki-form" onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nama">Nama Baki</Label>
                <Input
                  id="nama"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: Baki 1"
                  required
                />
              </div>
            </form>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Batal
              </Button>
              <Button type="submit" form="baki-form" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {detailOpen && selectedBaki && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseDetail}>
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Detail Baki Penyimpanan</h2>
                <p className="text-sm text-muted-foreground">Informasi lengkap baki beserta daftar barang yang tersimpan.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseDetail}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Nama Baki</Label>
                  <p className="font-medium text-base">{selectedBaki.nama}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">
                  Daftar Barang
                  {!detailBarangLoading && (
                    <span className="text-muted-foreground font-normal ml-1">({detailBarang.length} item)</span>
                  )}
                </h4>
                {detailBarangLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : detailBarang.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground border rounded-md">
                    Tidak ada barang dalam baki ini.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Barcode</TableHead>
                          <TableHead>Nama Barang</TableHead>
                          <TableHead>Kadar</TableHead>
                          <TableHead>Berat (gr)</TableHead>
                          <TableHead>Harga</TableHead>
                          <TableHead>Kondisi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailBarang.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="text-xs font-medium">{b.barcode}</TableCell>
                            <TableCell className="font-medium">{b.nama}</TableCell>
                            <TableCell>{b.karat?.name ?? "-"}</TableCell>
                            <TableCell>{b.berat}</TableCell>
                            <TableCell>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(b.harga)}</TableCell>
                            <TableCell className="capitalize">{b.kondisi}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Baki</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus data baki ini secara permanen. Seluruh referensi barang ke baki ini juga akan terpengaruh.
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
