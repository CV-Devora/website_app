"use client";

import { useState } from "react";
import { api } from "@/lib/api";
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

import { toast } from "sonner";
import { Loader2, FileDown, CheckCircle2 } from "lucide-react";
import templateUrl from "@/components/Template Barang.xlsx";

export interface ImportError {
  row: number;
  barcode?: string;
  message: string;
}

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors?: ImportError[];
}

interface BarangImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported?: () => void | Promise<void>;
}

export function BarangImportDialog({ open, onOpenChange, onImported }: BarangImportDialogProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const close = () => {
    if (importing) return;
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportResult(null);
    }
  };

  const downloadTemplate = async () => {
    try {
      const res = await fetch(templateUrl);
      if (!res.ok) throw new Error("template tidak ditemukan");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Template Barang.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengunduh template:", err);
      toast.error("Gagal mengunduh template.");
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.warning("Pilih file Excel/CSV terlebih dahulu.");
      return;
    }
    setImporting(true);
    setImportResult(null);
    try {
      const res = await api.barang.importFile(importFile);
      setImportResult(res.data as ImportResult);
      toast.success(`Import selesai: ${(res.data as ImportResult).imported} barang berhasil ditambahkan.`);
      await onImported?.();
    } catch (err) {
      console.error("Import gagal:", err);
      toast.error(err instanceof Error ? err.message : "Gagal mengimport file.");
    } finally {
      setImporting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={close}>
      <div className="bg-background rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Import Data Barang</h2>
            <p className="text-sm text-muted-foreground">
              Upload file Excel (.xlsx) atau CSV dengan daata yang valid.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={close} disabled={importing}>
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </Button>
        </div>

        <div className="flex flex-col gap-5 p-6 overflow-y-auto">
          {importResult ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <CheckCircle2 className="size-8 text-green-600 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">Import selesai</p>
                  <p className="text-muted-foreground">
                    {importResult.imported} dari {importResult.total} baris berhasil diimport.
                    {importResult.skipped > 0 && ` ${importResult.skipped} baris dilewati.`}
                  </p>
                </div>
              </div>
              {importResult.errors && importResult.errors.length > 0 ? (
                <div className="rounded-md border">
                  <div className="px-4 py-3 border-b bg-muted/50 text-sm font-medium">
                    Daftar baris yang dilewati ({importResult.errors.length})
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Baris</TableHead>
                          <TableHead>Barcode</TableHead>
                          <TableHead>Alasan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importResult.errors.map((err, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm">{err.row}</TableCell>
                            <TableCell className="text-sm font-medium">{err.barcode || "-"}</TableCell>
                            <TableCell className="text-sm text-red-600">{err.message}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-green-700">
                  Tidak ada baris yang gagal diimport.
                </p>
              )}
              <Button className="w-full" onClick={close}>
                Selesai
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="import-file">File Data Barang</Label>
                  <Button variant="link" size="sm" className="px-0 text-sm" onClick={downloadTemplate}>
                    <FileDown className="mr-1 size-4" />
                    Download Template
                  </Button>
                </div>
                <Input
                  id="import-file"
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileChange}
                />
                {importFile && (
                  <p className="text-sm text-muted-foreground">
                    File terpilih: <span className="font-medium text-foreground">{importFile.name}</span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {!importResult && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t">
            <Button type="button" variant="outline" onClick={close} disabled={importing}>
              Batal
            </Button>
            <Button type="button" onClick={handleImport} disabled={importing}>
              {importing && <Loader2 className="mr-2 size-4 animate-spin" />}
              Import
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
