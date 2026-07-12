"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";

interface Karat {
  id: string;
  name: string;
  harga: number;
}

interface Baki {
  id: string;
  nama: string;
}

interface BarangItem {
  barcode: string;
  nama: string;
  karat: string;
  berat: string;
  harga: string;
  photo: string;
  kondisi: string;
  baki_id: string;
}

export default function TambahPembelianPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [karatList, setKaratList] = useState<Karat[]>([]);
  const [bakiList, setBakiList] = useState<Baki[]>([]);

  const [formData, setFormData] = useState({
    no_faktur: "",
    nama: "",
    tipe_pemasok: "supplier",
  });

  const [items, setItems] = useState<BarangItem[]>([
    {
      barcode: "",
      nama: "",
      karat: "",
      berat: "",
      harga: "",
      photo: "",
      kondisi: "baru",
      baki_id: "",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resKarat, resBaki] = await Promise.all([
        api.karat.list(),
        api.baki.list(),
      ]);
      setKaratList(resKarat.data as Karat[]);
      setBakiList(resBaki.data as Baki[]);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        barcode: "",
        nama: "",
        karat: "",
        berat: "",
        harga: "",
        photo: "",
        kondisi: "baru",
        baki_id: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BarangItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.no_faktur || !formData.nama) return;

    const validItems = items.filter((item) => item.nama && item.berat && item.harga);
    if (validItems.length === 0) {
      alert("Minimal satu barang harus diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const totalHarga = validItems.reduce(
        (sum, item) => sum + parseInt(item.harga.replace(/\D/g, "") || "0", 10),
        0
      );

      const payload = {
        no_faktur: formData.no_faktur,
        nama: formData.nama,
        tipe_pemasok: formData.tipe_pemasok,
        harga_deal: totalHarga,
        barang: validItems.map((item, idx) => ({
          barcode: item.barcode || `BRG-${formData.no_faktur}-${idx + 1}`,
          nama: item.nama,
          karat: parseInt(item.karat, 10) || 0,
          berat: parseFloat(item.berat.replace(",", ".")) || 0,
          harga: parseInt(item.harga.replace(/\D/g, ""), 10) || 0,
          photo: item.photo,
          kondisi: item.kondisi,
          baki_id: item.baki_id || null,
        })),
      };

      await api.pembelian.create(payload);
      router.push("/pembelian");
    } catch (error) {
      console.error("Gagal menyimpan pembelian:", error);
      alert("Gagal menyimpan pembelian.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/pembelian")}>
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tambah Pembelian
          </h1>
          <p className="text-sm text-muted-foreground">
            Masukkan data pembelian dan barang baru.
          </p>
        </div>
      </div>

      <form id="pembelian-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Pembelian</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              <Label htmlFor="no_faktur">Nomor Faktur</Label>
              <Input
                id="no_faktur"
                value={formData.no_faktur}
                onChange={(e) => setFormData({ ...formData, no_faktur: e.target.value })}
                placeholder="Contoh: INV-2024-001"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="nama">Nama Pemasok</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Toko Mas Jaya"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="tipe_pemasok">Tipe Pemasok</Label>
              <select
                id="tipe_pemasok"
                value={formData.tipe_pemasok}
                onChange={(e) => setFormData({ ...formData, tipe_pemasok: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="supplier">Supplier</option>
                <option value="pelanggan">Pelanggan</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Data Barang</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-1 size-4" /> Tambah Barang
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">Nama Barang</TableHead>
                    <TableHead className="min-w-[100px]">Kadar</TableHead>
                    <TableHead className="min-w-[100px]">Berat (gr)</TableHead>
                    <TableHead className="min-w-[130px]">Harga (Rp)</TableHead>
                    <TableHead className="min-w-[110px]">Kondisi</TableHead>
                    <TableHead className="min-w-[120px]">Baki</TableHead>
                    <TableHead className="min-w-[140px]">Photo</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Input
                          value={item.nama}
                          onChange={(e) => updateItem(idx, "nama", e.target.value)}
                          placeholder="Nama barang"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.karat}
                          onChange={(e) => updateItem(idx, "karat", e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="">Pilih</option>
                          {karatList.map((k) => (
                            <option key={k.id} value={k.id}>
                              {k.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={item.berat}
                          onChange={(e) => updateItem(idx, "berat", e.target.value)}
                          placeholder="0.000"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={item.harga}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            updateItem(idx, "harga", val);
                          }}
                          placeholder="0"
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.kondisi}
                          onChange={(e) => updateItem(idx, "kondisi", e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="baru">Baru</option>
                          <option value="bekas">Bekas</option>
                          <option value="rusak">Rusak</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.baki_id}
                          onChange={(e) => updateItem(idx, "baki_id", e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="">Pilih</option>
                          {bakiList.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.nama}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.photo}
                          onChange={(e) => updateItem(idx, "photo", e.target.value)}
                          placeholder="URL photo"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(idx)}
                          disabled={items.length <= 1}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/pembelian")}>
            Batal
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Simpan Pembelian
          </Button>
        </div>
      </form>
    </div>
  );
}
