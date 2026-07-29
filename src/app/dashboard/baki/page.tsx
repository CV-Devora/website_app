"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Baki {
  id: string;
  nama: string;
  berat?: number;
}

const initialForm = { nama: "", berat: "" };

export default function BakiPage() {
  const [bakis, setBakis] = useState<Baki[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBakis();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role?.toLowerCase());
      } catch {
        // ignore malformed user payload
      }
    }
  }, []);

  const fetchBakis = async () => {
    try {
      setLoading(true);
      const res = await api.baki.list();
      setBakis(res.data as Baki[]);
    } catch (error) {
      console.error("Failed to fetch bakis:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSheet = (baki?: Baki) => {
    if (baki) {
      setEditingId(baki.id);
      setFormData({ nama: baki.nama, berat: baki.berat?.toString() ?? "" });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;

    setSubmitting(true);
    try {
      const payload: { nama: string; berat?: number } = { nama: formData.nama };
      if (formData.berat) payload.berat = parseFloat(formData.berat);

      if (editingId) {
        await api.baki.update(editingId, payload);
      } else {
        await api.baki.create(payload);
      }
      await fetchBakis();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save baki:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus baki ini?")) return;
    try {
      await api.baki.delete(id);
      await fetchBakis();
    } catch (error) {
      console.error("Failed to delete baki:", error);
    }
  };

  const isAdmin = userRole === "admin";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Baki"
        description="Manage storage trays used to organize your jewelry."
        action={
          isAdmin && (
            <Button onClick={() => handleOpenSheet()}>
              <Plus className="mr-2 size-4" />
              Tambah Baki
            </Button>
          )
        }
      />

      <Card>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : bakis.length === 0 ? (
            <EmptyState
              title="Belum ada baki"
              description="Tambahkan baki pertama untuk mulai mengelompokkan barang."
              action={
                isAdmin && (
                  <Button onClick={() => handleOpenSheet()}>
                    <Plus className="mr-2 size-4" />
                    Tambah Baki
                  </Button>
                )
              }
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Baki</TableHead>
                    <TableHead>Berat (gr)</TableHead>
                    {isAdmin && <TableHead className="w-[100px] text-right">Aksi</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bakis.map((baki) => (
                    <TableRow key={baki.id}>
                      <TableCell className="font-medium">{baki.nama}</TableCell>
                      <TableCell>{baki.berat != null ? `${baki.berat} gr` : "-"}</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenSheet(baki)}
                            title="Edit"
                          >
                            <Pencil className="size-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(baki.id)}
                            title="Hapus"
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md p-0 flex flex-col gap-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{editingId ? "Edit Baki" : "Tambah Baki"}</SheetTitle>
            <SheetDescription>
              {editingId ? "Ubah data baki di bawah ini." : "Masukkan data baki baru."}
            </SheetDescription>
          </SheetHeader>

          <form id="baki-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <label htmlFor="nama" className="text-sm font-medium">
                Nama Baki
              </label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Baki 1"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="berat" className="text-sm font-medium">
                Berat (gr)
              </label>
              <Input
                id="berat"
                type="text"
                inputMode="decimal"
                value={formData.berat}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, "");
                  setFormData({ ...formData, berat: val });
                }}
                placeholder="Contoh: 50.5"
              />
            </div>
          </form>

          <SheetFooter className="px-6 py-4 border-t mt-auto">
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCloseSheet}>
                Batal
              </Button>
              <Button type="submit" form="baki-form" className="flex-1" disabled={submitting}>
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