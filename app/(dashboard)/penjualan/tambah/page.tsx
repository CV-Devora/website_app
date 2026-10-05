"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@base-ui/react/combobox";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Check, ChevronsUpDown } from "lucide-react";

interface User {
  id: string;
  nama: string;
  role: string;
  kode_sales?: number | null;
}

interface Barang {
  id: string;
  barcode: string;
  nama: string;
  karat?: { id: string; name: string };
  berat: number;
  harga: number;
  kondisi: string;
}

interface BarangItem {
  value: string;
  label: string;
  berat: number;
}

export default function TambahPenjualanPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [currentUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });
  const [selectedBarang, setSelectedBarang] = useState<BarangItem | null>(null);

  const [formData, setFormData] = useState({
    no_faktur: "",
    nama: "",
    harga_jual: "",
    ongkos: "",
    total_harga: "",
    cash: "",
    transfer: "",
    debet: "",
  });

  const fetchBarang = async () => {
    try {
      const resBarang = await api.barang.list();
      setBarangList(resBarang.data as Barang[]);
    } catch (error) {
      console.error("Gagal memuat data barang:", error);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const barangItems: BarangItem[] = barangList.map((b) => ({
    value: b.id,
    label: b.nama,
    berat: b.berat,
  }));

  const handleSubmit = async () => {
    if (
      !formData.no_faktur ||
      !formData.nama ||
      !selectedBarang ||
      !currentUser
    )
      return;

    const num = (v: string) => parseInt(v.replace(/\D/g, "") || "0", 10);
    const paymentTotal = num(formData.cash) + num(formData.transfer) + num(formData.debet);

    if (paymentTotal !== num(formData.total_harga)) {
      toast.warning("Jumlah Cash + Transfer + Debet harus sama dengan Total Nilai.");
      return;
    }

    if (selectedBarang.berat <= 0) {
      toast.warning("Berat barang tidak valid.");
      return;
    }

    const hargaGram = Math.round(num(formData.harga_jual) / selectedBarang.berat);

    setSubmitting(true);
    try {
      const payload = {
        no_faktur: formData.no_faktur,
        nama: formData.nama,
        total_harga: num(formData.total_harga),
        kode_sales: currentUser.kode_sales ?? null,
        harga_gram: hargaGram,
        harga_jual: num(formData.harga_jual),
        ongkos: num(formData.ongkos),
        cash: num(formData.cash),
        transfer: num(formData.transfer),
        debet: num(formData.debet),
        barang_ids: [selectedBarang.value],
      };

      await api.penjualan.create(payload);
      router.push("/penjualan");
    } catch (error) {
      console.error("Gagal menyimpan penjualan:", error);
      toast.error("Gagal menyimpan penjualan.");
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value.replace(/\D/g, "") }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/penjualan")} className="mr-2 shrink-0">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Tambah Penjualan
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Isi seluruh data penjualan secara manual.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 w-full sm:w-auto">
          <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => router.push("/penjualan")}>
            Batal
          </Button>
          <Button type="button" className="flex-1 sm:flex-none" onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Simpan Penjualan
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Data Penjualan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 pt-0">
            <div className="flex flex-col gap-3">
              <Label htmlFor="no_faktur">Nomor Faktur</Label>
              <Input
                id="no_faktur"
                value={formData.no_faktur}
                onChange={(e) => setFormData({ ...formData, no_faktur: e.target.value })}
                placeholder="Contoh: SELL-2024-001"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="nama">Nama Pelanggan</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Pelanggan A"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Data Barang</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 pt-0">
            <div className="flex flex-col gap-3">
              <Label>Nama Barang</Label>
              <Combobox.Root
                items={barangItems}
                value={selectedBarang}
                onValueChange={(value) => setSelectedBarang(value)}
                autoHighlight
              >
                <div className="relative">
                  <Combobox.Input
                    className="flex h-10 w-full items-center rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Cari barang..."
                    required
                  />
                  <div className="absolute right-0 top-0 flex h-full items-center pr-2 text-muted-foreground pointer-events-none">
                    <ChevronsUpDown className="size-4" />
                  </div>
                </div>
                <Combobox.Portal>
                  <Combobox.Positioner className="outline-none" sideOffset={4}>
                    <Combobox.Popup className="z-50 w-[var(--anchor-width)] max-w-[var(--available-width)] rounded-md border bg-popover text-popover-foreground shadow-md data-starting-style:scale-95 data-starting-style:opacity-0 data-starting-style:duration-100 data-starting-style:ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100 data-ending-style:ease-in">
                      <Combobox.Empty>
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Barang tidak ditemukan.
                        </div>
                      </Combobox.Empty>
                      <Combobox.List className="max-h-72 overflow-y-auto overscroll-contain p-1 outline-none">
                        {(item: BarangItem) => (
                          <Combobox.Item
                            key={item.value}
                            value={item}
                            className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                          >
                            <span className="flex-1">{item.label}</span>
                            <Combobox.ItemIndicator className="data-selected:inline-flex hidden items-center">
                              <Check className="size-4" />
                            </Combobox.ItemIndicator>
                          </Combobox.Item>
                        )}
                      </Combobox.List>
                    </Combobox.Popup>
                  </Combobox.Positioner>
                </Combobox.Portal>
              </Combobox.Root>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="berat">Berat (gr)</Label>
              <Input
                id="berat"
                value={selectedBarang ? `${selectedBarang.berat} gr` : ""}
                placeholder="Pilih barang terlebih dahulu"
                disabled
                className="bg-muted"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="harga_jual">Harga Jual (Rp)</Label>
              <Input
                id="harga_jual"
                type="text"
                value={formData.harga_jual}
                onChange={setField("harga_jual")}
                placeholder="Contoh: 4500000"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="ongkos">Ongkos (Rp)</Label>
              <Input
                id="ongkos"
                type="text"
                value={formData.ongkos}
                onChange={setField("ongkos")}
                placeholder="Contoh: 100000"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="total_harga">Total Nilai (Rp)</Label>
              <Input
                id="total_harga"
                type="text"
                value={formData.total_harga}
                onChange={setField("total_harga")}
                placeholder="Contoh: 4600000"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 pt-0">
            <div className="flex flex-col gap-3">
              <Label htmlFor="cash">Cash (Rp)</Label>
              <Input
                id="cash"
                type="text"
                value={formData.cash}
                onChange={setField("cash")}
                placeholder="Contoh: 2000000"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="transfer">Transfer (Rp)</Label>
              <Input
                id="transfer"
                type="text"
                value={formData.transfer}
                onChange={setField("transfer")}
                placeholder="Contoh: 2000000"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="debet">Debet (Rp)</Label>
              <Input
                id="debet"
                type="text"
                value={formData.debet}
                onChange={setField("debet")}
                placeholder="Contoh: 600000"
                required
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
