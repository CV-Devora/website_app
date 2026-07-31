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

interface Karat {
  id: string;
  name: string;
  harga: number;
}

export default function KaratPage() {
  const [karats, setKarats] = useState<Karat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: "", harga: "" });
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchKarats();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role?.toLowerCase());
      } catch (e) {}
    }
  }, []);

  const fetchKarats = async () => {
    try {
      setLoading(true);
      const res = await api.karat.list();
      setKarats(res.data as Karat[]);
    } catch (error) {
      console.error("Failed to fetch karats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [karats]);

  const handleOpenSheet = (karat?: Karat) => {
    if (karat) {
      setEditingId(karat.id);
      setFormData({ name: karat.name, harga: karat.harga.toString() });
    } else {
      setEditingId(null);
      setFormData({ name: "", harga: "" });
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingId(null);
    setFormData({ name: "", harga: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.harga) return;
    
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        harga: parseInt(formData.harga.replace(/\D/g, ""), 10),
      };

      if (editingId) {
        await api.karat.update(editingId, payload);
        toast.success("Data karat berhasil diperbarui.");
      } else {
        await api.karat.create(payload);
        toast.success("Data karat berhasil ditambahkan.");
      }
      await fetchKarats();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save karat:", error);
      toast.error("Gagal menyimpan data karat.");
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
      await api.karat.delete(deleteId);
      toast.success("Data karat berhasil dihapus.");
      await fetchKarats();
    } catch (error) {
      console.error("Failed to delete karat:", error);
      toast.error("Gagal menghapus data karat.");
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
    () => karats.filter((k) => k.name.toLowerCase().includes(search.toLowerCase())),
    [karats, search]
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
            Manajemen Kadar Emas
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola jenis kadar karat beserta harga jual per gram.
          </p>
        </div>
        {userRole === "admin" && (
          <Button onClick={() => handleOpenSheet()}>
            <Plus className="mr-2 size-4" />
            Tambah Karat
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kadar Karat</CardTitle>
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
                placeholder="Cari kadar karat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kadar Karat</TableHead>
                    <TableHead>Harga / Gram</TableHead>
                    {userRole === "admin" && (
                      <TableHead className="w-[100px] text-right">Aksi</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={userRole === "admin" ? 3 : 2} className="h-24 text-center">
                        Belum ada data kadar karat.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((karat) => (
                      <TableRow key={karat.id}>
                        <TableCell className="font-medium">{karat.name}</TableCell>
                        <TableCell>{formatRupiah(karat.harga)}</TableCell>
                        {userRole === "admin" && (
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenSheet(karat)}
                              title="Edit"
                            >
                              <Pencil className="size-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDelete(karat.id)}
                              title="Hapus"
                            >
                              <Trash2 className="size-4 text-red-600" />
                            </Button>
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
            <SheetTitle>{editingId ? "Ubah Data Karat" : "Tambah Kadar Karat Baru"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Perbarui nama dan harga kadar karat di bawah ini."
                : "Isi formulir berikut untuk menambahkan kadar karat baru."}
            </SheetDescription>
          </SheetHeader>
          
          <form id="karat-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Kadar Karat</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: 24K"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="harga">Harga / Gram (Rp)</Label>
              <Input
                id="harga"
                type="text"
                value={formData.harga}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, harga: val });
                }}
                placeholder="Contoh: 1000000"
                required
              />
            </div>
          </form>

          <SheetFooter className="px-6 py-4 border-t mt-auto">
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCloseSheet}>
                Batal
              </Button>
              <Button type="submit" form="karat-form" className="flex-1" disabled={submitting}>
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
            <AlertDialogTitle>Hapus Karat</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus data kadar karat ini secara permanen. Tindakan ini tidak dapat dibatalkan.
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
