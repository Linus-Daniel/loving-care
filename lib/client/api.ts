import type { ApiEnvelope } from "@/types";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function queryString(params?: Record<string, string | number | boolean | null | undefined>) {
  if (!params) return "";
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    search.set(key, String(value));
  }

  const value = search.toString();
  return value ? `?${value}` : "";
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !envelope.success) {
    throw new Error(envelope.error ?? "Request failed");
  }

  return envelope;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>,
) {
  return apiFetch<T>(`${path}${queryString(params)}`);
}
