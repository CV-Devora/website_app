const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token") ?? "";
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...getAuthHeaders(), ...(init?.headers ?? {}) },
  });
  const json = await res.json();
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
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/barang", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/barang/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/barang/${id}`, { method: "DELETE" }),
  },
  pembelian: {
    list: () => apiFetch<{ code: number; data: unknown[] }>("/pembelian"),
    get: (id: string) => apiFetch<{ code: number; data: unknown }>(`/pembelian/${id}`),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/pembelian", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/pembelian/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/pembelian/${id}`, { method: "DELETE" }),
  },
  penjualan: {
    list: () => apiFetch<{ code: number; data: unknown[] }>("/penjualan"),
    get: (id: string) => apiFetch<{ code: number; data: unknown }>(`/penjualan/${id}`),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/penjualan", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/penjualan/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/penjualan/${id}`, { method: "DELETE" }),
  },
  karat: {
    list: () => apiFetch<{ code: number; data: unknown[] }>("/karat"),
    get: (id: string) => apiFetch<{ code: number; data: unknown }>(`/karat/${id}`),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/karat", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/karat/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/karat/${id}`, { method: "DELETE" }),
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
    get: (id: string) => apiFetch<{ code: number; data: unknown }>(`/users/${id}`),
    create: (body: unknown) =>
      apiFetch<{ code: number; data: unknown }>("/users", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      apiFetch<{ code: number; data: unknown }>(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) =>
      apiFetch<{ code: number }>(`/users/${id}`, { method: "DELETE" }),
  },
};