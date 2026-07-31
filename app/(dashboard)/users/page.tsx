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

interface User {
  id: string;
  nama: string;
  username: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ nama: "", username: "", password: "", role: "sales" });
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.users.list();
      setUsers(res.data as User[]);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [users]);

  const handleOpenSheet = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setFormData({ nama: user.nama, username: user.username, password: "", role: user.role });
    } else {
      setEditingId(null);
      setFormData({ nama: "", username: "", password: "", role: "sales" });
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingId(null);
    setFormData({ nama: "", username: "", password: "", role: "sales" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.username || !formData.role) return;

    setSubmitting(true);
    try {
      const payload: any = {
        nama: formData.nama,
        username: formData.username,
        role: formData.role,
      };

      if (editingId) {
        await api.users.update(editingId, payload);
        toast.success("Pengguna berhasil diperbarui.");
      } else {
        if (!formData.password) {
          toast.warning("Password diperlukan untuk pengguna baru!");
          setSubmitting(false);
          return;
        }
        payload.password = formData.password;
        await api.users.create(payload);
        toast.success("Pengguna berhasil ditambahkan.");
      }
      await fetchUsers();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error("Gagal menyimpan pengguna.");
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
      await api.users.delete(deleteId);
      toast.success("Pengguna berhasil dihapus.");
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Gagal menghapus pengguna.");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredData = useMemo(
    () => users.filter((u) => u.nama.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase())),
    [users, search]
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
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola akun, hak akses, dan peran pengguna sistem.
          </p>
        </div>
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="mr-2 size-4" />
          Tambah Pengguna
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Akun Pengguna</CardTitle>
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
                placeholder="Cari nama atau username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead className="w-[100px] text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Tidak ada data pengguna yang terdaftar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nama}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenSheet(user)}
                            title="Edit"
                          >
                            <Pencil className="size-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(user.id)}
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
            <SheetTitle>{editingId ? "Ubah Data Pengguna" : "Tambah Pengguna Baru"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Perbarui informasi akun pengguna di bawah ini."
                : "Isi formulir berikut untuk membuat akun pengguna baru."}
            </SheetDescription>
          </SheetHeader>

          <form id="user-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Contoh: budi"
                required
              />
            </div>

            {!editingId && (
              <div className="flex flex-col gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password minimal 6 karakter"
                  required={!editingId}
                />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Label htmlFor="role">Peran Pengguna</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="sales">Sales</option>
                <option value="kasir">Kasir</option>
              </select>
            </div>
          </form>

          <SheetFooter className="px-6 py-4 border-t mt-auto">
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCloseSheet}>
                Batal
              </Button>
              <Button type="submit" form="user-form" className="flex-1" disabled={submitting}>
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
            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghapus akun pengguna ini secara permanen. Tindakan ini tidak dapat dibatalkan.
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
