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
import { toast } from "sonner";
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
  jumlah: string;
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

  const formatNumber = (val: string) => {
    if (!val) return val;
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [barcodeStart, setBarcodeStart] = useState(0);

  const [items, setItems] = useState<BarangItem[]>([
    {
      barcode: "",
      nama: "",
      karat: "",
      berat: "",
      harga: "",
      jumlah: "1",
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
      const [resKarat, resBaki, resBarcode] = await Promise.all([
        api.karat.list(),
        api.baki.list(),
        api.barang.latestBarcode(),
      ]);
      setKaratList(resKarat.data as Karat[]);
      setBakiList(resBaki.data as Baki[]);
      setBarcodeStart(resBarcode.data);
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
        jumlah: "1",
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
      toast.warning("Minimal satu barang harus diisi.");
      return;
    }

    setSubmitting(true);
    try {
      let barcodeCounter = barcodeStart + 1;
      const expandedBarang = validItems.flatMap((item) => {
        const count = parseInt(item.jumlah || "1", 10);
        return Array.from({ length: count }, () => ({
          nama: item.nama,
          karat_id: item.karat || null,
          berat: parseFloat(item.berat.replace(",", ".")) || 0,
          harga: parseInt(item.harga.replace(/\D/g, ""), 10) || 0,
          photo: item.photo,
          kondisi: item.kondisi,
          baki_id: item.baki_id || null,
        }));
      });

      const totalHarga = expandedBarang.reduce(
        (sum, item) => sum + item.harga,
        0
      );

      const payload = {
        no_faktur: formData.no_faktur,
        nama: formData.nama,
        tipe_pemasok: formData.tipe_pemasok,
        harga_deal: totalHarga,
        barang: expandedBarang.map((item) => ({
          ...item,
          barcode: String(barcodeCounter++).padStart(9, "0"),
        })),
      };

      await api.pembelian.create(payload);
      router.push("/pembelian");
    } catch (error) {
      console.error("Gagal menyimpan pembelian:", error);
      toast.error("Gagal menyimpan pembelian.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex">
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
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/pembelian")}>
            Batal
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Simpan Pembelian
          </Button>
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
                className="flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="supplier">Supplier</option>
                <option value="pelanggan">Pelanggan</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Data Barang</h2>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-1 size-4" /> Tambah Barang
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {items.map((item, idx) => {
              const selectedKarat = karatList.find((k) => k.id === item.karat);
              const hargaKadar = selectedKarat ? selectedKarat.harga : 0;

              return (
                <Card key={idx} className="relative overflow-hidden">
                  <div className="absolute top-3 right-6 z-10">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(idx)}
                      disabled={items.length <= 1}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <CardHeader className="px-6 space-y-2">
                    <CardTitle className="text-base">Barang #{idx + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <div className="flex flex-col gap-2">
                        <Label>Nama Barang</Label>
                        <Input
                          value={item.nama}
                          onChange={(e) => updateItem(idx, "nama", e.target.value)}
                          placeholder="Contoh: Gelang Emas"
                          required
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Label>Kadar</Label>
                        <select
                          value={item.karat}
                          onChange={(e) => updateItem(idx, "karat", e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="">Pilih Kadar</option>
                          {karatList.map((k) => (
                            <option key={k.id} value={k.id}>
                              {k.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Harga Kadar</Label>
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                          {hargaKadar > 0 ? `Rp ${formatNumber(hargaKadar.toString())}` : "-"}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Berat (gr)</Label>
                        <Input
                          type="text"
                          value={item.berat}
                          onChange={(e) => updateItem(idx, "berat", e.target.value)}
                          placeholder="0.000"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Harga Deal (Rp)</Label>
                        <Input
                          type="text"
                          value={formatNumber(item.harga)}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            updateItem(idx, "harga", raw);
                          }}
                          placeholder="0"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Kondisi</Label>
                        <select
                          value={item.kondisi}
                          onChange={(e) => updateItem(idx, "kondisi", e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="baru">Baru</option>
                          <option value="bekas">Bekas</option>
                          <option value="rusak">Rusak</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Baki</Label>
                        <select
                          value={item.baki_id}
                          onChange={(e) => updateItem(idx, "baki_id", e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="">Pilih Baki</option>
                          {bakiList.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.nama}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Jumlah</Label>
                        <Input
                          type="text"
                          value={item.jumlah}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "");
                            updateItem(idx, "jumlah", raw || "1");
                          }}
                          placeholder="1"
                        />
                      </div>

                      <div className="flex flex-col gap-2 lg:col-span-2 xl:col-span-1">
                        <Label>Photo</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await api.upload(file);
                                updateItem(idx, "photo", url);
                              } catch (err) {
                                console.error("Upload gagal:", err);
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
