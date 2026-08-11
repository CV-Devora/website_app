const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001/api/v1";
const UPLOAD_BASE = API_BASE.replace("/api/v1", "");

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token") ?? "";
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

function toQuery(params: Record<string, string | undefined>): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

async function downloadFile(path: string, fallbackName: string): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = "Gagal mengunduh file";
    try {
      const json = await res.json();
      message = json.message ?? message;
    } catch {
      // ignore non-JSON error body
    }
    throw new Error(message);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fallbackName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...getAuthHeaders(), ...(init?.headers ?? {}) },
  });
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("unauthorized");
  }
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`API error (invalid JSON): ${text.slice(0, 100)}`);
  }
  if (!res.ok) throw new Error(json.message ?? "API error");
  return json;
}

export const api = {
  auth: {
    login: (body: { username: string; password: string }) =>
      apiFetch<{
        code: number;
        data: { access_token: string; refresh_token: string; user: Record<string, unknown> };
      }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  },
  dashboard: {
    get: () =>
      apiFetch<{
        code: number;
        data: {
          barang_chart: { label: string; value: number }[];
          penjualan_chart: { label: string; value: number }[];
          pembelian_chart: { label: string; value: number }[];
        };
      }>("/dashboard"),
  },
  barang: {
    list: () => apiFetch<{ code: number; data: unknown[] }>("/barang"),
    get: (id: string) => apiFetch<{ code: number; data: unknown }>(`/barang/${id}`),
    latestBarcode: () =>
      apiFetch<{ code: number; data: number }>("/barang/latest-barcode"),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/barang", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/barang/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/barang/${id}`, { method: "DELETE" }),
    export: () =>
      downloadFile("/barang/export", `daftar_barang.xlsx`),
    importFile: async (file: File) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/barang/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error(`Import gagal (invalid JSON): ${text.slice(0, 100)}`);
      }
      if (!res.ok) throw new Error(json.message ?? "Import gagal");
      return json;
    },
  },
  pembelian: {
    list: (from?: string, to?: string) =>
      apiFetch<{ code: number; data: unknown[] }>(`/pembelian${toQuery({ from, to })}`),
    get: (id: string) => apiFetch<{ code: number; data: unknown }>(`/pembelian/${id}`),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/pembelian", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/pembelian/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/pembelian/${id}`, { method: "DELETE" }),
    approve: (id: string) =>
      apiFetch<{ code: number; data: unknown }>(`/pembelian/${id}/approve`, { method: "PUT" }),
    export: (from: string, to: string) =>
      downloadFile(`/pembelian/export${toQuery({ from, to })}`, `pembelian_${from}_${to}.xlsx`),
  },
  penjualan: {
    list: (from?: string, to?: string) =>
      apiFetch<{ code: number; data: unknown[] }>(`/penjualan${toQuery({ from, to })}`),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/penjualan", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/penjualan/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/penjualan/${id}`, { method: "DELETE" }),
    export: (from: string, to: string) =>
      downloadFile(`/penjualan/export${toQuery({ from, to })}`, `penjualan_${from}_${to}.xlsx`),
  },
  karat: {
    list: () => apiFetch<{ code: number; data: unknown[] }>("/karat"),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/karat", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/karat/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/karat/${id}`, { method: "DELETE" }),
  },
  upload: async (file: File): Promise<string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Upload failed");
    return `${UPLOAD_BASE}${json.data}`;
  },
  baki: {
    list: () => apiFetch<{ code: number; data: unknown[] }>("/baki"),
    get: (id: string) => apiFetch<{ code: number; data: unknown }>(`/baki/${id}`),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/baki", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/baki/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/baki/${id}`, { method: "DELETE" }),
  },
  users: {
    list: () => apiFetch<{ code: number; data: unknown[] }>("/users"),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/users", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/users/${id}`, { method: "DELETE" }),
  },
};
