"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

interface Barang {
  id: string;
  barcode: string;
  nama: string;
  karat: number;
  berat: number;
  harga: number;
  photo?: string;
  kondisi: string;
  pembelian_id?: string;
  baki_id?: string;
  grup_id?: string;
}

const initialForm = {
  barcode: "",
  nama: "",
  karat: "",
  berat: "",
  harga: "",
  photo: "",
  kondisi: "baru",
};

export default function ProductsPage() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBarangs();
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

  const fetchBarangs = async () => {
    try {
      setLoading(true);
      const res = await api.barang.list();
      setBarangs(res.data as Barang[]);
    } catch (error) {
      console.error("Failed to fetch barangs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSheet = (barang?: Barang) => {
    if (barang) {
      setEditingId(barang.id);
      setFormData({
        barcode: barang.barcode,
        nama: barang.nama,
        karat: barang.karat.toString(),
        berat: barang.berat.toString(),
        harga: barang.harga.toString(),
        photo: barang.photo ?? "",
        kondisi: barang.kondisi,
      });
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
    if (!formData.barcode || !formData.nama || !formData.karat || !formData.berat || !formData.harga) return;

    setSubmitting(true);
    try {
      const payload = {
        barcode: formData.barcode,
        nama: formData.nama,
        karat: parseInt(formData.karat, 10),
        berat: parseFloat(formData.berat),
        harga: parseInt(formData.harga.replace(/\D/g, ""), 10),
        photo: formData.photo || undefined,
        kondisi: formData.kondisi,
      };

      if (editingId) {
        await api.barang.update(editingId, payload);
      } else {
        await api.barang.create(payload);
      }
      await fetchBarangs();
      handleCloseSheet();
    } catch (error) {
      console.error("Failed to save barang:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus barang ini?")) return;
    try {
      await api.barang.delete(id);
      await fetchBarangs();
    } catch (error) {
      console.error("Failed to delete barang:", error);
    }
  };

  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const isAdmin = userRole === "admin";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Manage your jewelry product catalog."
        action={
          isAdmin && (
            <Button onClick={() => handleOpenSheet()}>
              <Plus className="mr-2 size-4" />
              Tambah Barang
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
          ) : barangs.length === 0 ? (
            <EmptyState
              title="Belum ada barang"
              description="Tambahkan barang pertama untuk mulai mengelola katalog."
              action={
                isAdmin && (
                  <Button onClick={() => handleOpenSheet()}>
                    <Plus className="mr-2 size-4" />
                    Tambah Barang
                  </Button>
                )
              }
            />
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barcode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Karat</TableHead>
                    <TableHead>Berat (gr)</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Kondisi</TableHead>
                    {isAdmin && <TableHead className="w-[100px] text-right">Aksi</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barangs.map((barang) => (
                    <TableRow key={barang.id}>
                      <TableCell className="font-mono text-sm">{barang.barcode}</TableCell>
                      <TableCell className="font-medium">{barang.nama}</TableCell>
                      <TableCell>{barang.karat}K</TableCell>
                      <TableCell>{barang.berat} gr</TableCell>
                      <TableCell>{formatRupiah(barang.harga)}</TableCell>
                      <TableCell>
                        <Badge variant={barang.kondisi === "baru" ? "default" : "secondary"}>
                          {barang.kondisi}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenSheet(barang)}
                            title="Edit"
                          >
                            <Pencil className="size-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(barang.id)}
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
            <SheetTitle>{editingId ? "Edit Barang" : "Tambah Barang"}</SheetTitle>
            <SheetDescription>
              {editingId ? "Ubah detail barang di bawah ini." : "Masukkan detail barang baru."}
            </SheetDescription>
          </SheetHeader>

          <form id="barang-form" onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2">
              <label htmlFor="barcode" className="text-sm font-medium">
                Barcode
              </label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Contoh: BC001"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="nama" className="text-sm font-medium">
                Nama Barang
              </label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Gelang Emas"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="karat" className="text-sm font-medium">
                  Karat
                </label>
                <Input
                  id="karat"
                  type="number"
                  value={formData.karat}
                  onChange={(e) => setFormData({ ...formData, karat: e.target.value })}
                  placeholder="24"
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
                  placeholder="5.5"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="harga" className="text-sm font-medium">
                Harga (Rp)
              </label>
              <Input
                id="harga"
                type="text"
                value={formData.harga}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, harga: val });
                }}
                placeholder="Contoh: 5000000"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="kondisi" className="text-sm font-medium">
                Kondisi
              </label>
              <select
                id="kondisi"
                value={formData.kondisi}
                onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="baru">Baru</option>
                <option value="bekas">Bekas</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="photo" className="text-sm font-medium">
                URL Foto (opsional)
              </label>
              <Input
                id="photo"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </form>

          <SheetFooter className="px-6 py-4 border-t mt-auto">
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCloseSheet}>
                Batal
              </Button>
              <Button type="submit" form="barang-form" className="flex-1" disabled={submitting}>
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