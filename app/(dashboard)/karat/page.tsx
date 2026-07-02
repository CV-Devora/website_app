"use client";

import { useEffect, useState } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

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
      } else {
        await api.karat.create(payload);
      }
      await fetchKarats();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save karat:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus karat ini?")) return;
    try {
      await api.karat.delete(id);
      await fetchKarats();
    } catch (error) {
      console.error("Failed to delete karat:", error);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kelola Karat
          </h1>
          <p className="text-sm text-muted-foreground">
            Tambah, ubah, dan atur harga untuk setiap jenis karat.
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
          <CardTitle>Daftar Karat</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Karat</TableHead>
                    <TableHead>Harga / Gram</TableHead>
                    {userRole === "admin" && (
                      <TableHead className="w-[100px] text-right">Aksi</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {karats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={userRole === "admin" ? 3 : 2} className="h-24 text-center">
                        Tidak ada data karat.
                      </TableCell>
                    </TableRow>
                  ) : (
                    karats.map((karat) => (
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
                              onClick={() => handleDelete(karat.id)}
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
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col gap-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{editingId ? "Edit Karat" : "Tambah Karat"}</SheetTitle>
            <SheetDescription>
              {editingId
                ? "Ubah nama dan harga karat di bawah ini."
                : "Masukkan nama dan harga karat baru."}
            </SheetDescription>
          </SheetHeader>
          
          <form id="karat-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Nama Karat</Label>
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
    </div>
  );
}
